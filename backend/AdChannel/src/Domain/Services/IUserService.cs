using AdChannel.Domain.Models.Users;

namespace AdChannel.Domain.Services
{
    public interface IUserService
    {
        Task<User> RegisterAsync(User user, string password);
        Task<User> Login(User user);
        Task<User?> GetByIdAsync(Guid userId);
        Task<User> ReplenishBalanceAsync(Guid userId, double amount);
        Task<User?> GetByChannelIdAsync(Guid channelId);
        Task TransferToChannelAsync(Guid channelId, double amount);
    }
}
