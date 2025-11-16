using AdChannel.Domain.Models.Users;
using AdChannel.infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AdChannel.Domain.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _userRepo;

        public UserService(IRepository<User> userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task<User> RegisterAsync(User user, string password)
        {
            var exists = await _userRepo.ExistsAsync(u => u.Email == user.Email);
            if (exists)
                throw new InvalidOperationException("Email уже используется");

            await _userRepo.AddAsync(user);
            await _userRepo.SaveChangesAsync();
            return user;
        }
        public Task<User> Login(User user) => throw new NotImplementedException();

        public async Task<User?> GetByIdAsync(Guid userId)
        {
            return await _userRepo.GetWithIncludeAsync(
                u => u.Id == userId,
                query => query
                    .Include(u => u.Company)
                    .Include(u => u.Channel)
            );
        }

        public async Task<User> ReplenishBalanceAsync(Guid userId, double amount)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            user.Balance += amount;
            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();
            return user;
        }

        public async Task<User?> GetByChannelIdAsync(Guid channelId)
        {
            return await _userRepo.GetWithIncludeAsync(
                u => u.Channel != null && u.Channel.Id == channelId,
                query => query
                    .Include(u => u.Channel)
            );
        }

        public async Task TransferToChannelAsync(Guid channelId, double amount)
        {
            var user = await GetByChannelIdAsync(channelId);
            if (user == null)
                throw new InvalidOperationException("Channel user not found");

            user.Balance += amount;
            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();
        }
    }
}
