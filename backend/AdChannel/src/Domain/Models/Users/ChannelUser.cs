namespace AdChannel.Domain.Models.Users
{
    public class ChannelUser
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string ChannelName { get; set; } = string.Empty;
        public string ChannelLink { get; set; } = string.Empty;
        public string? City { get; set; }
        public string? ChannelTheme { get; set; }
        public string? ChannelDescription { get; set; }
        public string? MembersAge { get; set; }

        public User User { get; set; }
    }
}
