using AdChannel.Domain.Models.Ads;
using AdChannel.Domain.Models.Users;
using Microsoft.EntityFrameworkCore;

namespace AdChannel.infrastructure.Persistence.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<CompanyUser> CompanyUsers => Set<CompanyUser>();
        public DbSet<ChannelUser> ChannelUsers => Set<ChannelUser>();
        public DbSet<CompanyAd> CompanyAds => Set<CompanyAd>();
        public DbSet<AdToPost> AdsToPosts => Set<AdToPost>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User → Company (1-to-1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Company)
                .WithOne(c => c.User)
                .HasForeignKey<CompanyUser>(c => c.UserId);

            // User → Channel (1-to-1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Channel)
                .WithOne(ch => ch.User)
                .HasForeignKey<ChannelUser>(ch => ch.UserId);

            // Уникальность email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }
    }
}
