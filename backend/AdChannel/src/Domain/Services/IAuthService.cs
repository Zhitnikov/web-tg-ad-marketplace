using AdChannel.Domain.Models.Users;

namespace AdChannel.Domain.Services
{
    public interface IAuthService
    {
        Task<string?> LoginAsync(string email, string password);
        Task<User?> GetUserByEmailAsync(string email);
    }
}
