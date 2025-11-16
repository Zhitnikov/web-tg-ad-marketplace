# Новая миграция
dotnet ef migrations add {название миграции} --output-dir infrastructure/Persistence/Migrations

# Обновить БД
dotnet ef database update

# Откат
dotnet ef database update PreviousMigrationName
