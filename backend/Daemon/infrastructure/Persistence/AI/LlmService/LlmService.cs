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
            var prompt =
                """
                Ты профессиональный копирайтер с многолетним опытом создания продающих текстов для Telegram-каналов. Твоя задача - создать максимально убедительный и качественный рекламный пост.
                Информация о продукте:
                Название: {productName}
                Описание: {description}
                Цена: {price} рублей

                Процесс создания текста:
                1. СНАЧАЛА проанализируй продукт: подумай о его уникальных особенностях, преимуществах, целевой аудитории и эмоциональных триггерах
                2. ЗАТЕМ продумай структуру: как лучше всего представить продукт, чтобы вызвать интерес и желание купить
                3. ПОТОМ создай черновик: напиши несколько вариантов ключевых фраз и предложений
                4. НАКОНЕЦ отшлифуй текст: выбери лучшие формулировки, убедись что текст цепляющий и продающий

                Требования к финальному тексту:
                1. Объем: 4-6 предложений (80-120 слов)
                2. Структура:
                   - Первое предложение: цепляющий заголовок, который привлекает внимание и вызывает интерес. Должен быть максимально интригующим
                   - 2-3 предложения: детальное описание ключевых преимуществ и выгод продукта, подчеркивающее его уникальность. Используй конкретные факты и эмоциональные триггеры
                   - Последнее предложение: четкий и мотивирующий призыв к действию (например, "Узнайте больше по ссылке" или "Закажите прямо сейчас")
                3. Стиль: живой, разговорный, но профессиональный. Используй активные глаголы, конкретные факты и эмоциональные триггеры
                4. Акцент: подчеркни уникальность и ценность продукта для покупателя, создай ощущение срочности и выгоды
                5. Формат: обычный текст без эмодзи, хештегов, разметки Markdown, звездочек или других символов форматирования
                6. Язык: естественный русский язык, без канцеляризмов, с использованием живых оборотов речи

                ВАЖНО: Потрать время на размышление. Подумай тщательно над каждым словом. Создай текст, который действительно продает и вызывает желание купить. Верни ТОЛЬКО готовый текст поста, без дополнительных пояснений, без кавычек, без префиксов типа "Вот пост:" или "Текст поста:". Начни сразу с текста поста.
                """;

            const int maxRetries = 3;
            Exception? lastException = null;

            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    var request = new
                    {
                        model = "lakomoor/vikhr-llama-3.2-1b-instruct:1b",
                        prompt,
                        stream = false,
                        options = new
                        {
                            num_predict = 500,
                            temperature = 0.8,
                            top_p = 0.95,
                            top_k = 50,
                            num_ctx = 8192,
                            repeat_penalty = 1.15,
                            seed = -1,
                            tfs_z = 1.0,
                            typical_p = 1.0,
                            mirostat = 0,
                            mirostat_eta = 0.1,
                            mirostat_tau = 5.0
                        }
                    };

                    var modelResponse = await GetClient.PostAsJsonAsync("/api/generate", request);

                    if (!modelResponse.IsSuccessStatusCode)
                    {
                        var error = await modelResponse.Content.ReadAsStringAsync();
                        Console.WriteLine(
                            $"Ollama error (attempt {attempt}/{maxRetries}): {modelResponse.StatusCode} — {error}");

                        if (attempt < maxRetries)
                        {
                            await Task.Delay(1000 * attempt);
                            continue;
                        }

                        throw new Exception($"Ollama error: {error}");
                    }

                    modelResponse.EnsureSuccessStatusCode();

                    var json = await modelResponse.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<JsonElement>(json);
                    var response = result.GetProperty("response").GetString() ?? description;

                    response = System.Text.RegularExpressions.Regex.Replace(response, @"\[.*?\]", "");
                    response = System.Text.RegularExpressions.Regex.Replace(response, @"\(.*?\)", "");
                    response = response.Trim();

                    if (string.IsNullOrWhiteSpace(response) || response.Length < 20)
                    {
                        if (attempt < maxRetries)
                        {
                            Console.WriteLine(
                                $"Generated text too short (attempt {attempt}/{maxRetries}), retrying...");
                            await Task.Delay(1000 * attempt);
                            continue;
                        }
                    }

                    return response;
                }
                catch (Exception ex)
                {
                    lastException = ex;
                    Console.WriteLine($"Error generating text (attempt {attempt}/{maxRetries}): {ex.Message}");

                    if (attempt < maxRetries)
                    {
                        await Task.Delay(1000 * attempt);
                    }
                }
            }

            throw lastException ?? new Exception("Failed to generate text after multiple attempts");
        }

        public HttpClient GetClient { get; }
    }
}
