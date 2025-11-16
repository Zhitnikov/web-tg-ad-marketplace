using AdChannel.Domain.Models.Users;
using AdChannel.infrastructure.Persistence.Data;

namespace AdChannel.Domain.Services
{
    public class ChannelService : IChannelService
    {
        private readonly IRepository<ChannelUser> _channelRepo;
        private readonly IRepository<User> _userRepo;

        public ChannelService(IRepository<ChannelUser> channelRepo, IRepository<User> userRepo)
        {
            _channelRepo = channelRepo;
            _userRepo = userRepo;
        }

        public async Task<ChannelUser> RegisterAsync(ChannelUser channel, Guid userId)
        {
            channel.UserId = userId;
            await _channelRepo.AddAsync(channel);
            await _channelRepo.SaveChangesAsync();
            return channel;
        }

        public async Task<ChannelUser?> GetByEmailAsync(string email)
        {
            var user = await _userRepo.GetAsync(u => u.Email == email);

            if (user == null || user.Channel == null)
            {
                return null;
            }

            return await _channelRepo.GetByIdAsync(user.Channel.Id);
        }

        public async Task<ChannelUser?> GetByIdAsync(Guid id) => await _channelRepo.GetByIdAsync(id);
    }
}
