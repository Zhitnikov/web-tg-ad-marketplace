// RegisterUserDto.cs

namespace AdChannel.Domain.Models.Dto.Auth
{
    public class RegisterUserDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Role { get; set; } = "Company";

        // Company
        public string? CompanyName { get; set; }
        public string? Description { get; set; }

        // Channel
        public string? ChannelName { get; set; }
        public string? ChannelLink { get; set; }
        public string? City { get; set; }
        public string? ChannelTheme { get; set; }
        public string? ChannelDescription { get; set; }
        public string? MembersAge { get; set; }
    }
}
