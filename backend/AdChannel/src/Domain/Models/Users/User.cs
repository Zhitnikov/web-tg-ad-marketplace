namespace AdChannel.Domain.Models.Users
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Password { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public UserRole Role { get; set; }

        // Навигация
        public CompanyUser? Company { get; set; }
        public ChannelUser? Channel { get; set; }
    }
}
