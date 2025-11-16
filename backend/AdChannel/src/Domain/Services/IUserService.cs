using AdChannel.Domain.Models.Users;

namespace AdChannel.Domain.Services
{
    public interface IUserService
    {
        Task<User> RegisterAsync(User user, string password);
        Task<User> Login(User user);
    }
}
