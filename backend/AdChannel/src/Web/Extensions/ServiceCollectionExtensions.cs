using AdChannel.Domain.Services;
using AdChannel.infrastructure.Persistence.Data;

namespace AdChannel.Web.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddAdChannelServices(this IServiceCollection services)
        {
            // Репозитории
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            // Сервисы
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICompanyService, CompanyService>();
            services.AddScoped<IChannelService, ChannelService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAdService, AdService>();

            return services;
        }
    }
}
