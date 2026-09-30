using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public interface IDepartmentRepository : IGenericRepository<Department>
{
    Task<Department?> GetByIdWithProjectsAsync(int id);
    Task<IEnumerable<Department>> SearchByNameAsync(string name);
    Task<bool> HasProjectsAsync(int departmentId);
}
