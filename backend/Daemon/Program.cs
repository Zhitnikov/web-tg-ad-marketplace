using Daemon.infrastructure.Persistence.AI.LlmService;
using Daemon.infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices((context, services) =>
    {
        var connectionString = context.Configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<DaemonDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddHttpClient<LlmService>();
        services.AddScoped<LlmService>();

        services.AddHostedService<Daemon.Daemon>();
    })
    .Build();

await host.RunAsync();
