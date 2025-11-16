namespace AdChannel.Domain.Models.Ads
{
    public class CompanyAd
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required Guid UserId { get; set; }
        public required Guid CompanyId { get; set; }
        public required string ProductName { get; set; }
        public required double ProductPrice { get; set; }
        public required string ProductDescription { get; set; }
        public required string AgeOfTargetAudience { get; set; }
        public required double AdCost { get; set; }
        public string? LinkToProduct { get; set; }
        public bool IsCanceled { get; set; }
        public bool NeedAutoFormatingToTgPost { get; set; }
        public AdStatus Status { get; set; }
    }
}
