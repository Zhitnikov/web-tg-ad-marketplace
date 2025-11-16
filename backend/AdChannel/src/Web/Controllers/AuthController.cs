using AutoMapper;
using AdChannel.Domain.Models.Dto.Auth;
using AdChannel.Domain.Models.Users;
using AdChannel.Domain.Services;
using AdChannel.infrastructure.Persistence.Data;
using Microsoft.AspNetCore.Mvc;

namespace AdChannel.Web.Controllers
{
    [Microsoft.AspNetCore.Components.Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ICompanyService _companyService;
        private readonly IChannelService _channelService;
        private readonly IUserService _userService;
        private readonly IAuthService _authService;
        private readonly IRepository<User> _userRepo;
        private readonly IRepository<CompanyUser> _companyUserRepo;
        private readonly IRepository<ChannelUser> _channelUserRepo;
        private readonly IMapper _mapper;

        public AuthController(
            ICompanyService companyService,
            IChannelService channelService,
            IMapper mapper,
            IAuthService authService,
            IUserService userService,
            IRepository<User> userRepo,
            IRepository<CompanyUser> companyUserRepo,
            IRepository<ChannelUser> channelUserRepo)
        {
            _companyService = companyService;
            _channelService = channelService;
            _mapper = mapper;
            _authService = authService;
            _userService = userService;
            _userRepo = userRepo;
            _companyUserRepo = companyUserRepo;
            _channelUserRepo = channelUserRepo;
        }

        [HttpPost("register/user")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto dto)
        {
            var user = new User
            {
                Email = dto.Email,
                Password = dto.Password,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Telephone = dto.Telephone,
                Role = dto.Role == "Channel" ? UserRole.Channel : UserRole.Company,
            };

            var registeredUser = await _userService.RegisterAsync(user, dto.Password);

            if (registeredUser == null)
                return BadRequest("Registration failed");

            switch (user.Role)
            {
                case UserRole.Company:
                    var company = await CreateCompanyProfile(dto, registeredUser.Id);
                    registeredUser.Company = company;

                    await _companyUserRepo.AddAsync(company);
                    await _companyUserRepo.SaveChangesAsync();

                    return Ok(company);

                case UserRole.Channel:
                    var channel = await CreateChannelProfile(dto, registeredUser.Id);
                    registeredUser.Channel = channel;

                    await _channelUserRepo.AddAsync(channel);
                    await _channelUserRepo.SaveChangesAsync();

                    return Ok(channel);

                default:
                    return BadRequest("Invalid role");
            }
        }

        private Task<CompanyUser> CreateCompanyProfile(RegisterUserDto dto, Guid userId)
        {
            var company = new CompanyUser
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CompanyName = dto.CompanyName,
                Description = dto.Description,
            };

            return Task.FromResult(company);
        }

        private Task<ChannelUser> CreateChannelProfile(RegisterUserDto dto, Guid userId)
        {
            var channel = new ChannelUser
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ChannelName = dto.ChannelName,
                ChannelLink = dto.ChannelLink,
                City = dto.City,
                ChannelTheme = dto.ChannelTheme,
                ChannelDescription = dto.ChannelDescription,
                MembersAge = dto.MembersAge,
            };

            return Task.FromResult(channel);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var token = await _authService.LoginAsync(dto.Email, dto.Password);
            if (token == null)
                return Unauthorized("Invalid email or password");

            return Ok(
                new
                {
                    token,
                });
        }
    }
}
