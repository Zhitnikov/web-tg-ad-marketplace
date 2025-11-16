# Для создания локальной базы

docker compose up -d --build daemon

подключение к бд - jdbc:postgresql://localhost:1337/adchannel
пользователь postgres - пароль postgres

url - jdbc:postgresql://localhost:1337/adchannel?password=postgres&user=postgres

docker-compose up -d  # -d для background
docker-compose logs  # для просмотра логов
docker-compose down  # для остановки

# для ллм

docker exec -it ollama ollama run lakomoor/vikhr-llama-3.2-1b-instruct:1b


