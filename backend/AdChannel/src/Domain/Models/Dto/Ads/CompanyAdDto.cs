using System.ComponentModel.DataAnnotations;

namespace AdChannel.Domain.Models.Dto.Ads
{
    public class CompanyAdDto
    {
        [Required]
        public required string ProductName { get; set; }

        [Required]
        public required double ProductPrice { get; set; }

        [Required]
        public required string ProductDescription { get; set; }

        [Required]
        public required string AgeOfTargetAudience { get; set; }

        [Required]
        public required double AdCost { get; set; }

        [Required]
        public bool NeedAutoFormatingToTgPost { get; set; } = true;

        public string? LinkToProduct { get; set; }

        public string? ImageUrl { get; set; }

        public bool IsCanceled { get; set; } = false;
    }
}
