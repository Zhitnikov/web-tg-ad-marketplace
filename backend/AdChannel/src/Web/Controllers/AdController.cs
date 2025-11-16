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

        public AdController(IAdService adService)
        {
            _adService = adService;
        }

        [HttpPost("create")]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> CreateAd([FromBody] CompanyAdDto dto)
        {
            var ad = await _adService.CreateCampaign(User.GetUserId(), User.GetCompanyId(), dto);
            return Ok(ad);
        }

        // [HttpPost("accept/{campaignId:guid}")]
        // public async Task<IActionResult> Accept(Guid campaignId)
        // {
        //     var author = await _channelService.GetByIdAsync();
        //     var placement = await _adService.AcceptAd(author.Id, campaignId);
        //     return Ok(placement);
        // }
    }
}
