# === BASE ===
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# === BUILD ===
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# КОПИРУЕМ .csproj ИЗ КОРНЯ
COPY AdChannel.csproj ./

# Восстанавливаем пакеты
RUN dotnet restore

# Копируем весь код
COPY . .

# Сборка

RUN dotnet build "AdChannel.csproj" -c Release -o /app/build

# === PUBLISH ===
FROM build AS publish
RUN dotnet publish "AdChannel.csproj" -c Release -o /app/publish /p:UseAppHost=false

# === FINAL ===
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AdChannel.dll"]
