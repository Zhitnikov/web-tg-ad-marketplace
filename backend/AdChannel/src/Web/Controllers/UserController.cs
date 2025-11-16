using AdChannel.Domain.Services;
using AdChannel.Web.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdChannel.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.GetUserId();
            var user = await _userService.GetByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName,
                telephone = user.Telephone,
                role = user.Role.ToString(),
                balance = user.Balance,
                company = user.Company != null ? new
                {
                    id = user.Company.Id,
                    companyName = user.Company.CompanyName,
                    description = user.Company.Description
                } : null,
                channel = user.Channel != null ? new
                {
                    id = user.Channel.Id,
                    channelName = user.Channel.ChannelName,
                    channelLink = user.Channel.ChannelLink,
                    city = user.Channel.City,
                    channelTheme = user.Channel.ChannelTheme,
                    channelDescription = user.Channel.ChannelDescription,
                    membersAge = user.Channel.MembersAge
                } : null
            });
        }

        [HttpGet("balance")]
        public async Task<IActionResult> GetBalance()
        {
            var userId = User.GetUserId();
            var user = await _userService.GetByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            return Ok(new { balance = user.Balance });
        }

        [HttpPost("balance/replenish")]
        public async Task<IActionResult> ReplenishBalance([FromBody] ReplenishBalanceDto dto)
        {
            var userId = User.GetUserId();

            try
            {
                var user = await _userService.ReplenishBalanceAsync(userId, dto.Amount);
                return Ok(new { balance = user.Balance });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class ReplenishBalanceDto
    {
        public double Amount { get; set; }
    }
}

