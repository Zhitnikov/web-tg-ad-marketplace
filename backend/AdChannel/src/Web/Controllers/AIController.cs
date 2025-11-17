using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Json;
using System.Text.Json;

namespace AdChannel.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/ai")]
    public class AIController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public AIController(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            var daemonUrl = _configuration["Daemon:Url"] ?? "http://localhost:5001";
            _httpClient.BaseAddress = new Uri(daemonUrl);
        }

        [HttpPost("generate/post")]
        public async Task<IActionResult> GeneratePost([FromBody] GeneratePostDto dto)
        {
            const int maxRetries = 3;
            
            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    var request = new
                    {
                        productName = dto.ProductName,
                        description = dto.Description,
                        price = dto.Price
                    };

                    var response = await _httpClient.PostAsJsonAsync("/api/format/telegram", request);
                    
                    if (!response.IsSuccessStatusCode)
                    {
                        if (attempt < maxRetries)
                        {
                            await Task.Delay(1000 * attempt);
                            continue;
                        }
                        var error = await response.Content.ReadAsStringAsync();
                        return StatusCode((int)response.StatusCode, new { error });
                    }

                    var result = await response.Content.ReadAsStringAsync();
                    var json = JsonSerializer.Deserialize<JsonElement>(result);
                    
                    var generatedText = json.TryGetProperty("text", out var textProp) 
                        ? textProp.GetString() 
                        : result;

                    if (string.IsNullOrWhiteSpace(generatedText) || generatedText.Length < 20)
                    {
                        if (attempt < maxRetries)
                        {
                            await Task.Delay(1000 * attempt);
                            continue;
                        }
                    }

                    return Ok(new { text = generatedText });
                }
                catch (Exception ex)
                {
                    if (attempt < maxRetries)
                    {
                        await Task.Delay(1000 * attempt);
                        continue;
                    }
                    return StatusCode(500, new { error = ex.Message });
                }
            }

            return StatusCode(500, new { error = "Failed to generate post after multiple attempts" });
        }

        [HttpPost("generate/title")]
        public async Task<IActionResult> GenerateTitle([FromBody] GenerateTitleDto dto)
        {
            const int maxRetries = 3;
            
            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    var prompt = "Ты опытный копирайтер с глубоким пониманием психологии продаж. Твоя задача - создать максимально цепляющий и запоминающийся заголовок для рекламного поста.\n\n" +
                        $"Название продукта: {dto.ProductName}\n\n" +
                        "Требования к заголовку:\n" +
                        "- Длина: 4-7 слов (максимум 50 символов)\n" +
                        "- Стиль: яркий, привлекающий внимание, но без преувеличений. Используй эмоциональные триггеры\n" +
                        "- Формат: обычный текст, без эмодзи, без кавычек, без знаков препинания в конце\n" +
                        "- Фокус: подчеркни главную выгоду или уникальность продукта, создай интригу\n" +
                        "- Язык: естественный русский, живой и разговорный\n\n" +
                        "ВАЖНО: Подумай тщательно. Заголовок должен быть идеальным - цепляющим, запоминающимся и продающим. Верни ТОЛЬКО заголовок, без дополнительных слов, без префиксов типа \"Заголовок:\" или \"Вот заголовок:\". Начни сразу с заголовка.";
                    
                    var request = new
                    {
                        model = "lakomoor/vikhr-llama-3.2-1b-instruct:1b",
                        prompt = prompt,
                        stream = false,
                        options = new
                        {
                            num_predict = 150,
                            temperature = 0.85,
                            top_p = 0.95,
                            top_k = 50,
                            num_ctx = 4096,
                            repeat_penalty = 1.15,
                            seed = -1,
                            tfs_z = 1.0,
                            typical_p = 1.0
                        }
                    };

                    var ollamaUrl = _configuration["Ollama:Url"] ?? "http://localhost:11434";
                    var ollamaClient = new HttpClient { BaseAddress = new Uri(ollamaUrl) };
                    
                    var response = await ollamaClient.PostAsJsonAsync("/api/generate", request);
                    
                    if (!response.IsSuccessStatusCode)
                    {
                        if (attempt < maxRetries)
                        {
                            await Task.Delay(1000 * attempt);
                            continue;
                        }
                        return StatusCode((int)response.StatusCode, new { error = "Failed to generate title" });
                    }

                    var result = await response.Content.ReadAsStringAsync();
                    var json = JsonSerializer.Deserialize<JsonElement>(result);
                    
                    var generatedTitle = json.TryGetProperty("response", out var responseProp) 
                        ? responseProp.GetString()?.Trim() 
                        : null;

                    if (generatedTitle != null)
                    {
                        generatedTitle = System.Text.RegularExpressions.Regex.Replace(generatedTitle, @"\[.*?\]", "");
                        generatedTitle = System.Text.RegularExpressions.Regex.Replace(generatedTitle, @"\(.*?\)", "");
                        generatedTitle = generatedTitle.Trim();
                    }

                    if (string.IsNullOrWhiteSpace(generatedTitle) || generatedTitle.Length < 5)
                    {
                        if (attempt < maxRetries)
                        {
                            await Task.Delay(1000 * attempt);
                            continue;
                        }
                        generatedTitle = "Заголовок";
                    }

                    return Ok(new { title = generatedTitle });
                }
                catch (Exception ex)
                {
                    if (attempt < maxRetries)
                    {
                        await Task.Delay(1000 * attempt);
                        continue;
                    }
                    return StatusCode(500, new { error = ex.Message });
                }
            }

            return StatusCode(500, new { error = "Failed to generate title after multiple attempts" });
        }
    }

    public class GeneratePostDto
    {
        public string ProductName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Price { get; set; }
    }

    public class GenerateTitleDto
    {
        public string ProductName { get; set; } = string.Empty;
    }
}

