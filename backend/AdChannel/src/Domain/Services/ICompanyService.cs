using AdChannel.Domain.Models.Users;

namespace AdChannel.Domain.Services
{
    public interface ICompanyService
    {
        Task<CompanyUser> RegisterAsync(CompanyUser company, Guid userId);
        Task<CompanyUser?> GetByEmailAsync(string email);
        Task<CompanyUser?> GetByIdAsync(Guid id);
    }
}
