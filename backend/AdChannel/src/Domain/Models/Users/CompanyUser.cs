namespace AdChannel.Domain.Models.Users
{
    public class CompanyUser
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Навигация
        public User User { get; set; }
    }
}
