using System.Net.Http.Json;
using System.Text.Json;

namespace Daemon.infrastructure.Persistence.AI.LlmService
{
    public class LlmService
    {
        public LlmService(HttpClient client)
        {
            GetClient = client;
            GetClient.BaseAddress = new Uri("http://ollama:11434");
        }

        public async Task<string> FormatForTelegramAsync(string productName, string description, double price)
        {
            var prompt = $"""
                          Сгенерируй продающий пост для Telegram-канала на основе информации о продукте. 

                          Информация о продукте:
                          - Название: {productName}
                          - Цена: {price}₽
                          - Описание: {description}

                          Требования к посту:
                          - Объем: 3-5 предложений
                          - Тон: профессиональный, убедительный
                          - Структура: привлекающее внимание начало, описание преимуществ, призыв к действию
                          - Без эмодзи, хештегов и разметки
                          - Естественный русский язык
                          - Акцент на ценности продукта для покупателя

                          Сгенерируй ТОЛЬКО ТЕКСТ ПОСТА, БЕЗ ДОПОЛНИТЕЛЬНЫХ КОММЕНТАРИЕВ.
                          """;

            var request = new
            {
                model = "lakomoor/vikhr-llama-3.2-1b-instruct:1b",
                prompt,
                stream = false,
            };

            var modelResponse = await GetClient.PostAsJsonAsync("/api/generate", request);
            if (!modelResponse.IsSuccessStatusCode)
            {
                var error = await modelResponse.Content.ReadAsStringAsync();
                Console.WriteLine($"Ollama error: {modelResponse.StatusCode} — {error}");

                throw new Exception($"Ollama error: {error}");
            }

            modelResponse.EnsureSuccessStatusCode();

            var json = await modelResponse.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<JsonElement>(json);
            var response = result.GetProperty("response").GetString() ?? description;


            response = System.Text.RegularExpressions.Regex.Replace(response, @"\[.*?\]", "");
            response = response.Trim();

            return response;
        }

        public HttpClient GetClient { get; }
    }
}
