using AdChannel.Domain.Models.Users;
using AdChannel.infrastructure.Persistence.Data;

namespace AdChannel.Domain.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly IRepository<CompanyUser> _companyRepo;
        private readonly IRepository<User> _userRepo;

        public CompanyService(IRepository<CompanyUser> companyRepo, IRepository<User> userRepo)
        {
            _companyRepo = companyRepo;
            _userRepo = userRepo;
        }

        public async Task<CompanyUser> RegisterAsync(CompanyUser company, Guid userId)
        {
            company.UserId = userId;
            await _companyRepo.AddAsync(company);
            await _companyRepo.SaveChangesAsync();

            return company;
        }

        public async Task<CompanyUser?> GetByEmailAsync(string email)
        {
            var user = await _userRepo.GetAsync(u => u.Email == email);

            return await _companyRepo.GetByIdAsync(user.Company.Id);
        }

        public async Task<CompanyUser?> GetByIdAsync(Guid id) => await _companyRepo.GetByIdAsync(id);
    }
}
