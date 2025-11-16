# Новая миграция
dotnet ef migrations add {название миграции} --output-dir infrastructure/Persistence/Migrations

# Обновить БД
dotnet ef database update

# Откат
dotnet ef database update PreviousMigrationName

curl http://localhost:11434/api/generate -H "Content-Type: application/json" -d '{"model": "phi3.5:latest", "prompt": "Сделай красивый пост для Telegram: Курсы ЕГЭ по информатике, 1500₽, С нуля до 100 баллов! Коротко, с эмодзи, призывом к действию. Только текст поста.","stream": false }'

docker exec -it adchannel-web curl http://ollama:11434/api/generate -H "Content-Type: application/json" \-d '{"model": "phi3.5:latest","prompt": "Привет, мир!","stream": false }'
