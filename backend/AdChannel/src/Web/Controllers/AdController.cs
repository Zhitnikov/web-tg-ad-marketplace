using AdChannel.Domain.Models.Dto.Ads;
using AdChannel.Domain.Services;
using AdChannel.Web.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdChannel.Web.Controllers
{
    [Authorize]
    [Route("api/ads")]
    public class AdController : ControllerBase
    {
        private readonly IAdService _adService;
        private readonly IChannelService _channelService;
        private readonly ICompanyService _companyService;

        public AdController(IAdService adService, IChannelService channelService, ICompanyService companyService)
        {
            _adService = adService;
            _channelService = channelService;
            _companyService = companyService;
        }

        [HttpPost("create")]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> CreateAd([FromBody] CompanyAdDto dto)
        {
            var ad = await _adService.CreateCampaign(User.GetUserId(), User.GetCompanyId(), dto);
            return Ok(ad);
        }

        /// <summary>
        /// Канал принимает рекламу (берёт в очередь на публикацию)
        /// </summary>
        [HttpPost("accept/{campaignId:guid}")]
        [Authorize(Roles = "Channel")]
        public async Task<IActionResult> Accept(Guid campaignId)
        {
            var channelId = User.GetChannelId();
            var channel = await _channelService.GetByIdAsync(channelId);

            if (channel == null)
            {
                return NotFound("Channel not found");
            }

            await _adService.AcceptAd(channel.Id, campaignId);
            return Ok();
        }

        /// <summary>
        /// Канал отклоняет рекламу
        /// </summary>
        [HttpPost("reject/{campaignId:guid}")]
        [Authorize(Roles = "Channel")]
        public async Task<IActionResult> Reject(Guid campaignId)
        {
            var channelId = User.GetChannelId();
            var channel = await _channelService.GetByIdAsync(channelId);

            if (channel == null)
            {
                return NotFound("Channel not found");
            }

            await _adService.RejectAd(channel.Id, campaignId);
            return Ok();
        }

        /// <summary>
        /// Рекламные размещения, которые уже взял канал (в очереди)
        /// </summary>
        [HttpGet("channel/pending")]
        [Authorize(Roles = "Channel")]
        public async Task<IActionResult> GetChannelPendingAds()
        {
            var channelId = User.GetChannelId();
            var ads = await _adService.GetPendingAds(channelId);
            return Ok(ads);
        }

        /// <summary>
        /// Все рекламные кампании компании
        /// </summary>
        [HttpGet("company/my")]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> GetCompanyCampaigns()
        {
            var companyId = User.GetCompanyId();
            var campaigns = await _adService.GetMyCampaigns(companyId);
            return Ok(campaigns);
        }

        /// <summary>
        /// Доступные рекламы для каналов (маркетплейс)
        /// </summary>
        [HttpGet("available")]
        [Authorize(Roles = "Channel")]
        public async Task<IActionResult> GetAvailableAds()
        {
            var ads = await _adService.GetAvailableAdsForChannels();
            return Ok(ads);
        }

        /// <summary>
        /// Компания подтверждает выполнение рекламы каналом
        /// </summary>
        [HttpPost("confirm/{adToPostId:guid}")]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> ConfirmCompletion(Guid adToPostId)
        {
            var companyId = User.GetCompanyId();
            await _adService.ConfirmCompletion(companyId, adToPostId);
            return Ok();
        }

        /// <summary>
        /// Принятые рекламы компании (которые каналы взяли в работу)
        /// </summary>
        [HttpGet("company/accepted")]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> GetAcceptedAds()
        {
            var companyId = User.GetCompanyId();
            var ads = await _adService.GetAcceptedAdsForCompany(companyId);
            return Ok(ads);
        }

        [HttpPut("company/{campaignId:guid}")]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> UpdateCampaign(Guid campaignId, [FromBody] CompanyAdDto dto)
        {
            var campaign = await _adService.UpdateCampaign(User.GetUserId(), User.GetCompanyId(), campaignId, dto);
            return Ok(campaign);
        }

        [HttpDelete("company/{campaignId:guid}")]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> DeleteCampaign(Guid campaignId)
        {
            await _adService.DeleteCampaign(User.GetUserId(), User.GetCompanyId(), campaignId);
            return Ok(new { success = true });
        }

        [HttpPost("company/{campaignId:guid}/publish")]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> PublishCampaign(Guid campaignId)
        {
            await _adService.PublishCampaign(User.GetUserId(), User.GetCompanyId(), campaignId);
            return Ok(new { success = true });
        }
    }
}
