using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Daemon.infrastructure.Persistence.Data
{
    public class DaemonDbContextFactory : IDesignTimeDbContextFactory<DaemonDbContext>
    {
        public DaemonDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddJsonFile("appsettings.Development.json", optional: true)
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrEmpty(connectionString))
                throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

            var optionsBuilder = new DbContextOptionsBuilder<DaemonDbContext>();
            optionsBuilder.UseNpgsql(connectionString);

            return new DaemonDbContext(optionsBuilder.Options);
        }
    }
}
