using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo.Models;
using TaskItem = TaskTrack.Repo.Models.Task;

namespace TaskTrack.Repo.Repositories;

public class TaskRepository : GenericRepository<TaskItem>, ITaskRepository
{
    public TaskRepository(TaskManagementDbContext context) : base(context)
    {
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskItem>> GetAllActiveWithDetailsAsync()
    {
        return await _dbSet
            .AsNoTracking()
            .Include(t => t.Project)
                .ThenInclude(p => p.Department)
            .Include(t => t.TaskTags)
                .ThenInclude(tt => tt.Tag)
            .Where(t => t.IsActive)
            .OrderByDescending(t => t.CreatedDate)
            .ToListAsync();
    }

    public async System.Threading.Tasks.Task<TaskItem?> GetByIdWithTagsAsync(int id)
    {
        return await _dbSet
            .Include(t => t.Project)
                .ThenInclude(p => p.Department)
            .Include(t => t.TaskTags)
                .ThenInclude(tt => tt.Tag)
            .FirstOrDefaultAsync(t => t.TaskId == id);
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskItem>> GetByProjectIdAsync(int projectId)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(t => t.TaskTags)
                .ThenInclude(tt => tt.Tag)
            .Where(t => t.ProjectId == projectId && t.IsActive)
            .OrderByDescending(t => t.CreatedDate)
            .ToListAsync();
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskItem>> SearchAsync(string? title, short? status, short? priority, int? projectId, int? tagId)
    {
        var query = _dbSet
            .AsNoTracking()
            .Include(t => t.Project)
                .ThenInclude(p => p.Department)
            .Include(t => t.TaskTags)
                .ThenInclude(tt => tt.Tag)
            .Where(t => t.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(title))
        {
            var pattern = $"%{title.Trim().ToLower()}%";
            query = query.Where(t => EF.Functions.ILike(t.Title, pattern));
        }

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        if (priority.HasValue)
        {
            query = query.Where(t => t.Priority == priority.Value);
        }

        if (projectId.HasValue && projectId.Value > 0)
        {
            query = query.Where(t => t.ProjectId == projectId.Value);
        }

        if (tagId.HasValue && tagId.Value > 0)
        {
            query = query.Where(t => t.TaskTags.Any(tt => tt.TagId == tagId.Value));
        }

        return await query.OrderByDescending(t => t.CreatedDate).ToListAsync();
    }
}
