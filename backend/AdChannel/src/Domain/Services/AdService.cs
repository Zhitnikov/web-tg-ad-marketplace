using AdChannel.Domain.Models.Ads;
using AdChannel.Domain.Models.Ads.AdChannel.Domain.Models.Ads;
using AdChannel.Domain.Models.Dto.Ads;
using AdChannel.infrastructure.Persistence.Data;

namespace AdChannel.Domain.Services
{
    public class AdService : IAdService
    {
        private readonly IRepository<CompanyAd> _companyAdsRepo;
        private readonly IRepository<AdToPost> _adToPostRepo;

        public AdService(IRepository<CompanyAd> companyAdsRepo, IRepository<AdToPost> adToPostRepo)
        {
            _companyAdsRepo = companyAdsRepo;
            _adToPostRepo = adToPostRepo;
        }

        public async Task<CompanyAd> CreateCampaign(Guid userId, Guid companyId, CompanyAdDto dto)
        {
            var companyAd = await _companyAdsRepo.GetAsync(c => c.Id == companyId && c.UserId == userId);

            if (companyAd != null)
                throw new UnauthorizedAccessException("Ad already exists");

            var ad = new CompanyAd
            {
                UserId = userId,
                CompanyId = companyId,
                ProductName = dto.ProductName,
                ProductPrice = dto.ProductPrice,
                ProductDescription = dto.ProductDescription,
                AgeOfTargetAudience = dto.AgeOfTargetAudience,
                AdCost = dto.AdCost,
                NeedAutoFormatingToTgPost = dto.NeedAutoFormatingToTgPost,
                LinkToProduct = dto.LinkToProduct,
                IsCanceled = dto.IsCanceled,
                Status = AdStatus.Available,
            };

            await _companyAdsRepo.AddAsync(ad);
            await _companyAdsRepo.SaveChangesAsync();

            return ad;
        }

        // TODO сделать метод изменения рекламной кампании

        public async Task AcceptAd(Guid channelId, Guid channelAdId)
        {
            var ad = await _adToPostRepo.GetAsync(c => c.Id == channelAdId);

            if (ad == null)
                throw new UnauthorizedAccessException("Ad not found");

            ad.PostStatus = AdPostStatus.InQueue;
            ad.ChannelId = channelId;
        }

        public async Task RejectAd(Guid channelId, Guid channelAdId)
        {
            var channelAd = await _adToPostRepo.GetAsync(c => c.Id == channelAdId);

            if (channelAd == null)
                throw new UnauthorizedAccessException("Ad not found");

            var companyAd = await _companyAdsRepo.GetAsync(c => c.Id == channelAd.CompanyAdId);

            channelAd.PostStatus = AdPostStatus.Available;
            channelAd.ChannelId = null;
            companyAd.Status = AdStatus.Available;
        }

        public Task<ICollection<AdToPost>> GetPendingAds(Guid channelId) => throw new NotImplementedException();

        public Task<ICollection<CompanyAd>> GetMyCampaigns(Guid companyId) => throw new NotImplementedException();
    }
}
