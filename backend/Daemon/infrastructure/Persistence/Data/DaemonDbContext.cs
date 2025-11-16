using AdChannel.Domain.Models.Ads;
using Microsoft.EntityFrameworkCore;

namespace Daemon.infrastructure.Persistence.Data
{
    public class DaemonDbContext : DbContext
    {
        public DaemonDbContext(DbContextOptions<DaemonDbContext> options) : base(options)
        {
        }

        public DbSet<AdToPost> AdsToPosts => Set<AdToPost>();
        public DbSet<CompanyAd> CompanyAds => Set<CompanyAd>();
    }
}
