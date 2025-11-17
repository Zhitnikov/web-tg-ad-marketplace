using AdChannel.Domain.Models.Ads.AdChannel.Domain.Models.Ads;

namespace AdChannel.Domain.Models.Ads
{
    public class AdToPost
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required Guid CompanyId { get; set; }
        public required Guid CompanyAdId { get; set; }
        public Guid? ChannelId { get; set; } = null;
        public AdPostStatus PostStatus { get; set; }
        public required string AdTitle { get; set; }
        public required string AdContent { get; set; }
        public required double AdCost { get; set; }
    }
}
