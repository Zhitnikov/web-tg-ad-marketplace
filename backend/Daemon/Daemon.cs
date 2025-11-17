using AdChannel.Domain.Models.Ads;
using Daemon.infrastructure.Persistence.AI.LlmService;
using Daemon.infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Polly;

namespace Daemon
{
    public class Daemon : BackgroundService
    {
        private readonly ILogger<Daemon> _logger;
        private readonly IServiceProvider _services;
        private readonly IConfiguration _config;
        private readonly LlmService _llmService;
        private readonly HttpClient _client;

        public Daemon(
            ILogger<Daemon> logger,
            IServiceProvider services,
            IConfiguration config,
            LlmService llmService,
            HttpClient client)
        {
            _logger = logger;
            _services = services;
            _config = config;
            _llmService = llmService;
            _client = client;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var interval = TimeSpan.FromSeconds(_config.GetValue("SyncIntervalSeconds", 10));

            await WaitForOllamaAsync(_llmService, stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                await SyncPublishedAdsAsync(stoppingToken);
                await Task.Delay(interval, stoppingToken);
            }
        }

        static async Task WaitForOllamaAsync(LlmService llmService, CancellationToken ct)
        {
            var policy = Policy
                .Handle<HttpRequestException>()
                .OrResult<bool>(success => !success)
                .WaitAndRetryAsync(
                    retryCount: 10,
                    sleepDurationProvider: retry => TimeSpan.FromSeconds(Math.Pow(2, retry)),
                    onRetry: (outcome, time, retry) =>
                        Console.WriteLine($"Ollama not ready... retry {retry} in {time}s"));

            await policy.ExecuteAsync(async () =>
            {
                try
                {
                    // Простая проверка через LlmService
                    var response = await llmService.GetClient.GetAsync("/api/tags", ct);
                    return response.IsSuccessStatusCode;
                }
                catch
                {
                    return false;
                }
            });
        }

        private async Task SyncPublishedAdsAsync(CancellationToken ct)
        {
            using var scope = _services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DaemonDbContext>();

            var availableCompanyAdsToGenerate = await db.CompanyAds
                .Where(cmpnAd => cmpnAd.Status == AdStatus.Published && cmpnAd.NeedAutoFormatingToTgPost.Equals(true))
                .Where(cmpnAd => !db.AdsToPosts.Any(ad => ad.CompanyAdId == cmpnAd.Id)).ToListAsync(ct);

            var posts = new List<AdToPost>();

            foreach (var ad in availableCompanyAdsToGenerate)
            {
                var generatedChannelAdContent = await _llmService.FormatForTelegramAsync(
                    ad.ProductName,
                    ad.ProductDescription,
                    ad.ProductPrice);

                _logger.LogInformation(
                    $"Для запроса {ad.ProductName}, {ad.ProductDescription}, {ad.ProductPrice} llm сделала такую рекламу: {generatedChannelAdContent}");

                var post = new AdToPost
                {
                    CompanyId = ad.CompanyId,
                    CompanyAdId = ad.Id,
                    AdTitle = ad.ProductName,
                    AdContent = generatedChannelAdContent,
                    AdCost = ad.AdCost,
                };

                _logger.LogInformation("Создан новый пост: {post}", post);

                posts.Add(post);
            }

            if (posts.Count != 0)
            {
                await db.AdsToPosts.AddRangeAsync(posts, ct);
                await db.SaveChangesAsync(ct);
                _logger.LogInformation("Было добавлено {Count} новых постов", posts.Count);
            }
            else
            {
                _logger.LogInformation("Не было добавлено новых постов");
            }
        }
    }
}
