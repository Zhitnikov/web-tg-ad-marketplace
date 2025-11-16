using AdChannel.Domain.Models.Ads;
using AdChannel.Domain.Models.Ads.AdChannel.Domain.Models.Ads;
using AdChannel.Domain.Models.Dto.Ads;
using AdChannel.infrastructure.Persistence.Data;
using AdChannel.Domain.Services;

namespace AdChannel.Domain.Services
{
    public class AdService : IAdService
    {
        private readonly IRepository<CompanyAd> _companyAdsRepo;
        private readonly IRepository<AdToPost> _adToPostRepo;
        private readonly IUserService _userService;
        private readonly IChannelService _channelService;

        public AdService(IRepository<CompanyAd> companyAdsRepo, IRepository<AdToPost> adToPostRepo, IUserService userService, IChannelService channelService)
        {
            _companyAdsRepo = companyAdsRepo;
            _adToPostRepo = adToPostRepo;
            _userService = userService;
            _channelService = channelService;
        }

        public async Task<CompanyAd> CreateCampaign(Guid userId, Guid companyId, CompanyAdDto dto)
        {

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
                ImageUrl = dto.ImageUrl,
                IsCanceled = dto.IsCanceled,
                Status = AdStatus.Created,
            };

            await _companyAdsRepo.AddAsync(ad);
            await _companyAdsRepo.SaveChangesAsync();

            return ad;
        }

        public async Task AcceptAd(Guid channelId, Guid campaignId)
        {
            var companyAd = await _companyAdsRepo.GetAsync(c => c.Id == campaignId);
            if (companyAd == null)
                throw new UnauthorizedAccessException("Campaign not found");

            if (companyAd.Status != AdStatus.Published)
                throw new InvalidOperationException("Campaign is not published");

            var existingAdToPost = await _adToPostRepo.GetAsync(a => a.CompanyAdId == campaignId && a.ChannelId == null);
            
            AdToPost adToPost;
            if (existingAdToPost != null)
            {
                adToPost = existingAdToPost;
            }
            else
            {
                adToPost = new AdToPost
                {
                    CompanyId = companyAd.CompanyId,
                    CompanyAdId = companyAd.Id,
                    AdTitle = companyAd.ProductName,
                    AdContent = companyAd.ProductDescription,
                    AdCost = companyAd.AdCost,
                    PostStatus = AdPostStatus.Available,
                    ChannelId = null
                };
                await _adToPostRepo.AddAsync(adToPost);
            }
            adToPost.PostStatus = AdPostStatus.InQueue;
            adToPost.ChannelId = channelId;
            companyAd.Status = AdStatus.InQueue;

            _adToPostRepo.Update(adToPost);
            _companyAdsRepo.Update(companyAd);
            await _adToPostRepo.SaveChangesAsync();
            await _companyAdsRepo.SaveChangesAsync();
        }

        public async Task RejectAd(Guid channelId, Guid channelAdId)
        {
            var channelAd = await _adToPostRepo.GetAsync(c => c.Id == channelAdId);

            if (channelAd == null)
                throw new UnauthorizedAccessException("Ad not found");

            var companyAd = await _companyAdsRepo.GetAsync(c => c.Id == channelAd.CompanyAdId);

            channelAd.PostStatus = AdPostStatus.Available;
            channelAd.ChannelId = null;
            companyAd.Status = AdStatus.Published;

            _adToPostRepo.Update(channelAd);
            _companyAdsRepo.Update(companyAd);
            await _adToPostRepo.SaveChangesAsync();
            await _companyAdsRepo.SaveChangesAsync();
        }

        public async Task<ICollection<AdToPost>> GetPendingAds(Guid channelId)
        {
            var ads = await _adToPostRepo.FindAsync(a =>
                a.ChannelId == channelId && a.PostStatus == AdPostStatus.InQueue);

            return ads.ToList();
        }

        public async Task<ICollection<CompanyAd>> GetMyCampaigns(Guid companyId)
        {
            var campaigns = await _companyAdsRepo.FindAsync(a => a.CompanyId == companyId);
            return campaigns.ToList();
        }

        public async Task<ICollection<CompanyAd>> GetAvailableAdsForChannels()
        {
            var ads = await _companyAdsRepo.FindAsync(a => a.Status == AdStatus.Published);
            return ads.ToList();
        }

        public async Task ConfirmCompletion(Guid companyId, Guid adToPostId)
        {
            var adToPost = await _adToPostRepo.GetAsync(a => a.Id == adToPostId);
            if (adToPost == null)
                throw new UnauthorizedAccessException("Ad not found");

            var companyAd = await _companyAdsRepo.GetAsync(a => a.Id == adToPost.CompanyAdId && a.CompanyId == companyId);
            if (companyAd == null)
                throw new UnauthorizedAccessException("Company ad not found or access denied");

            if (adToPost.PostStatus != AdPostStatus.InQueue || adToPost.ChannelId == null)
                throw new InvalidOperationException("Ad is not in queue or not accepted by channel");
            adToPost.PostStatus = AdPostStatus.Published;
            companyAd.Status = AdStatus.Published;

            _adToPostRepo.Update(adToPost);
            _companyAdsRepo.Update(companyAd);
            await _adToPostRepo.SaveChangesAsync();
            await _companyAdsRepo.SaveChangesAsync();

            if (adToPost.ChannelId.HasValue)
            {
                await _userService.TransferToChannelAsync(adToPost.ChannelId.Value, adToPost.AdCost);
            }
        }

        public async Task<ICollection<AcceptedAdDto>> GetAcceptedAdsForCompany(Guid companyId)
        {
            var ads = await _adToPostRepo.FindAsync(a =>
                a.CompanyId == companyId && 
                a.PostStatus == AdPostStatus.InQueue && 
                a.ChannelId != null);
            
            var result = new List<AcceptedAdDto>();
            foreach (var ad in ads)
            {
                var dto = new AcceptedAdDto
                {
                    Id = ad.Id,
                    CompanyAdId = ad.CompanyAdId,
                    AdTitle = ad.AdTitle,
                    AdContent = ad.AdContent,
                    AdCost = ad.AdCost,
                    ChannelId = ad.ChannelId,
                    PostStatus = (int)ad.PostStatus
                };

                if (ad.ChannelId.HasValue)
                {
                    var channel = await _channelService.GetByIdAsync(ad.ChannelId.Value);
                    if (channel != null)
                    {
                        dto.ChannelName = channel.ChannelName;
                        dto.ChannelLink = channel.ChannelLink;
                    }
                }

                result.Add(dto);
            }

            return result;
        }

        public async Task<CompanyAd> UpdateCampaign(Guid userId, Guid companyId, Guid campaignId, CompanyAdDto dto)
        {
            var campaign = await _companyAdsRepo.GetAsync(c => c.Id == campaignId && c.CompanyId == companyId);
            if (campaign == null)
                throw new UnauthorizedAccessException("Campaign not found or access denied");

            if (campaign.Status != AdStatus.Created)
                throw new InvalidOperationException("Only created campaigns can be edited");

            campaign.ProductName = dto.ProductName;
            campaign.ProductPrice = dto.ProductPrice;
            campaign.ProductDescription = dto.ProductDescription;
            campaign.AgeOfTargetAudience = dto.AgeOfTargetAudience;
            campaign.AdCost = dto.AdCost;
            campaign.NeedAutoFormatingToTgPost = dto.NeedAutoFormatingToTgPost;
            campaign.LinkToProduct = dto.LinkToProduct;
            campaign.ImageUrl = dto.ImageUrl;

            _companyAdsRepo.Update(campaign);
            await _companyAdsRepo.SaveChangesAsync();

            return campaign;
        }

        public async Task DeleteCampaign(Guid userId, Guid companyId, Guid campaignId)
        {
            var campaign = await _companyAdsRepo.GetAsync(c => c.Id == campaignId && c.CompanyId == companyId);
            if (campaign == null)
                throw new UnauthorizedAccessException("Campaign not found or access denied");

            if (campaign.Status == AdStatus.InQueue || campaign.Status == AdStatus.Published)
                throw new InvalidOperationException("Cannot delete campaign that is in queue or published");

            var adToPosts = await _adToPostRepo.FindAsync(a => a.CompanyAdId == campaignId);
            foreach (var adToPost in adToPosts)
            {
                _adToPostRepo.Delete(adToPost);
            }

            _companyAdsRepo.Delete(campaign);
            await _companyAdsRepo.SaveChangesAsync();
        }

        public async Task PublishCampaign(Guid userId, Guid companyId, Guid campaignId)
        {
            var campaign = await _companyAdsRepo.GetAsync(c => c.Id == campaignId && c.CompanyId == companyId);
            if (campaign == null)
                throw new UnauthorizedAccessException("Campaign not found or access denied");

            if (campaign.Status != AdStatus.Created)
                throw new InvalidOperationException("Only created campaigns can be published");

            campaign.Status = AdStatus.Published;
            _companyAdsRepo.Update(campaign);
            await _companyAdsRepo.SaveChangesAsync();
        }
    }
}
