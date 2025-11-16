using System.Linq.Expressions;

namespace AdChannel.infrastructure.Persistence.Data
{
    public interface IRepository<T>
        where T : class
    {
        Task<T?> GetByIdAsync(Guid id);
        Task<T?> GetAsync(Expression<Func<T, bool>> predicate);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task AddAsync(T entity);
        Task AddRangeAsync(IEnumerable<T> entities);
        void Update(T entity);
        void Delete(T entity);
        Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
        Task<int> SaveChangesAsync();

        Task<T?> GetWithIncludeAsync(
            Expression<Func<T, bool>> predicate,
            Func<IQueryable<T>, IQueryable<T>> include = null!);

    }
}
