using System.Linq.Expressions;

namespace TaskTrack.Repo.Repositories;

public interface IGenericRepository<T> where T : class
{
    System.Threading.Tasks.Task<IEnumerable<T>> GetAllAsync();
    System.Threading.Tasks.Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    System.Threading.Tasks.Task<T?> GetByIdAsync(int id);
    System.Threading.Tasks.Task AddAsync(T entity);
    void Update(T entity);
    void Remove(T entity);
    System.Threading.Tasks.Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
    System.Threading.Tasks.Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null);
}
