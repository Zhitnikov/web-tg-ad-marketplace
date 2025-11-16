# Для создания локальной базы

```
docker run --name hackaton-alfa -p 1337:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=postgres -d postgres
```

"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d postgres

подключение к бд - jdbc:postgresql://localhost:1337/postgres
пользователь postgres - пароль postgres

docker-compose up -d  # -d для background
docker-compose logs  # для просмотра логов
docker-compose down  # для остановки

# для ллм
docker exec -it ollama ollama pull phi3.5

docker exec -it ollama ollama run lakomoor/vikhr-llama-3.2-1b-instruct:1b


