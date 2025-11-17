using AdChannel.Domain.Models.Ads;
using AdChannel.Domain.Models.Dto.Ads;

namespace AdChannel.Domain.Services
{
    public interface IAdService
    {
        Task<CompanyAd> CreateCampaign(Guid userId, Guid companyId, CompanyAdDto dto);
        Task AcceptAd(Guid channelId, Guid campaignId);
        Task RejectAd(Guid channelId, Guid campaignId);
        Task<ICollection<AdToPost>> GetPendingAds(Guid channelId);
        Task<ICollection<CompanyAd>> GetMyCampaigns(Guid companyId);
        Task<ICollection<CompanyAd>> GetAvailableAdsForChannels();
        Task ConfirmCompletion(Guid companyId, Guid adToPostId);
        Task<ICollection<AcceptedAdDto>> GetAcceptedAdsForCompany(Guid companyId);
        Task<CompanyAd> UpdateCampaign(Guid userId, Guid companyId, Guid campaignId, CompanyAdDto dto);
        Task DeleteCampaign(Guid userId, Guid companyId, Guid campaignId);
        Task PublishCampaign(Guid userId, Guid companyId, Guid campaignId);
    }
}
