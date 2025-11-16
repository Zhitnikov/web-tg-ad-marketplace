using AdChannel.Domain.Models.Users;
using AdChannel.infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AdChannel.Domain.Services
{
    public class AuthService : IAuthService
    {
        private readonly IRepository<CompanyUser> _companyRepo;
        private readonly IRepository<ChannelUser> _channelRepo;
        private readonly IRepository<User> _userRepo;
        private readonly IConfiguration _config;

        public AuthService(
            IRepository<CompanyUser> companyRepo,
            IRepository<ChannelUser> channelRepo,
            IConfiguration config,
            IRepository<User> userRepo)
        {
            _companyRepo = companyRepo;
            _channelRepo = channelRepo;
            _userRepo = userRepo;
            _config = config;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            var user = await _userRepo.GetWithIncludeAsync(
                u => u.Email == email,
                q => q.Include(u => u.Company).Include(u => u.Channel));

            return user;
        }

        public async Task<string?> LoginAsync(string email, string password)
        {
            var user = await GetUserByEmailAsync(email);

            return user.Password == password ? GenerateJwtToken(user) : null;
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role is UserRole.Company ? "Company" : "Channel"),
                new Claim("CompanyId", user.Company?.Id.ToString() ?? ""),
                new Claim("ChannelId", user.Channel?.Id.ToString() ?? ""),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
