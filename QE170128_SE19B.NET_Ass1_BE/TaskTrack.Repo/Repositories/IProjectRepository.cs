using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public interface IProjectRepository : IGenericRepository<Project>
{
    Task<IEnumerable<Project>> GetAllWithDepartmentAsync();
    Task<Project?> GetByIdWithTasksAsync(int id);
    Task<IEnumerable<Project>> GetByDepartmentIdAsync(int departmentId);
    Task<IEnumerable<Project>> SearchAsync(string? name, short? status, int? departmentId);
    Task<bool> HasTasksAsync(int projectId);
}
