using AdChannel.Domain.Models.Users;

namespace AdChannel.Domain.Services
{
    public interface IChannelService
    {
        Task<ChannelUser> RegisterAsync(ChannelUser channel, Guid userId);
        Task<ChannelUser?> GetByEmailAsync(string email);
    }
}
