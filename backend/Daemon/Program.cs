using Daemon.infrastructure.Persistence.AI.LlmService;
using Daemon.infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<DaemonDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddHttpClient<LlmService>();
builder.Services.AddScoped<LlmService>();

builder.Services.AddHostedService<Daemon.Daemon>();
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");
app.MapControllers();

app.Urls.Add("http://localhost:5001");

await app.RunAsync();
