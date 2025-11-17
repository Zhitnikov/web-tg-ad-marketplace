using Daemon.infrastructure.Persistence.AI.LlmService;
using Microsoft.AspNetCore.Mvc;

namespace Daemon.Controllers
{
    [ApiController]
    [Route("api/format")]
    public class FormatController : ControllerBase
    {
        private readonly LlmService _llmService;

        public FormatController(LlmService llmService)
        {
            _llmService = llmService;
        }

        [HttpPost("telegram")]
        public async Task<IActionResult> FormatForTelegram([FromBody] FormatTelegramRequest request)
        {
            try
            {
                const int maxRetries = 3;
                Exception? lastException = null;

                for (int attempt = 1; attempt <= maxRetries; attempt++)
                {
                    try
                    {
                        var text = await _llmService.FormatForTelegramAsync(
                            request.productName,
                            request.description,
                            request.price);

                        if (string.IsNullOrWhiteSpace(text) || text.Length < 20)
                        {
                            if (attempt < maxRetries)
                            {
                                await Task.Delay(1000 * attempt);
                                continue;
                            }
                        }

                        return Ok(new { text });
                    }
                    catch (Exception ex)
                    {
                        lastException = ex;
                        if (attempt < maxRetries)
                        {
                            await Task.Delay(1000 * attempt);
                            continue;
                        }
                    }
                }

                throw lastException ?? new Exception("Failed to generate text after multiple attempts");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    public class FormatTelegramRequest
    {
        public string productName { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public double price { get; set; }
    }
}

