namespace AdChannel.Domain.Models.Dto.Ads
{
    public class AcceptedAdDto
    {
        public Guid Id { get; set; }
        public Guid CompanyAdId { get; set; }
        public string AdTitle { get; set; } = string.Empty;
        public string AdContent { get; set; } = string.Empty;
        public double AdCost { get; set; }
        public Guid? ChannelId { get; set; }
        public string? ChannelName { get; set; }
        public string? ChannelLink { get; set; }
        public int PostStatus { get; set; }
    }
}

