using AdChannel.Domain.Models.Users;
using AdChannel.infrastructure.Persistence.Data;

namespace AdChannel.Domain.Services
{
    public class ChannelService : IChannelService
    {
        private readonly IRepository<ChannelUser> _channelRepo;

        public ChannelService(IRepository<ChannelUser> channelRepo)
        {
            _channelRepo = channelRepo;
        }

        public async Task<ChannelUser> RegisterAsync(ChannelUser channel, Guid userId)
        {
            channel.UserId = userId;
            await _channelRepo.AddAsync(channel);
            await _channelRepo.SaveChangesAsync();
            return channel;
        }
        public Task<ChannelUser?> GetByEmailAsync(string email) => throw new NotImplementedException();
    }
}
