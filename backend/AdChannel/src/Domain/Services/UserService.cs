using AdChannel.Domain.Models.Users;
using AdChannel.infrastructure.Persistence.Data;

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
    }
}
