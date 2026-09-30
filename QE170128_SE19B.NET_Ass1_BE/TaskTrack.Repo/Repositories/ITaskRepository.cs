using TaskItem = TaskTrack.Repo.Models.Task;

namespace TaskTrack.Repo.Repositories;

public interface ITaskRepository : IGenericRepository<TaskItem>
{
    System.Threading.Tasks.Task<IEnumerable<TaskItem>> GetAllActiveWithDetailsAsync();
    System.Threading.Tasks.Task<TaskItem?> GetByIdWithTagsAsync(int id);
    System.Threading.Tasks.Task<IEnumerable<TaskItem>> GetByProjectIdAsync(int projectId);
    System.Threading.Tasks.Task<IEnumerable<TaskItem>> SearchAsync(string? title, short? status, short? priority, int? projectId, int? tagId);
}
