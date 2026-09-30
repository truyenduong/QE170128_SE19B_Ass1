using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public class ProjectRepository : GenericRepository<Project>, IProjectRepository
{
    public ProjectRepository(TaskManagementDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Project>> GetAllWithDepartmentAsync()
    {
        return await _dbSet
            .AsNoTracking()
            .Include(p => p.Department)
            .Where(p => p.IsActive)
            .OrderByDescending(p => p.CreatedDate)
            .ToListAsync();
    }

    public async Task<Project?> GetByIdWithTasksAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Department)
            .Include(p => p.Tasks.Where(t => t.IsActive))
                .ThenInclude(t => t.TaskTags)
                    .ThenInclude(tt => tt.Tag)
            .FirstOrDefaultAsync(p => p.ProjectId == id);
    }

    public async Task<IEnumerable<Project>> GetByDepartmentIdAsync(int departmentId)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(p => p.Department)
            .Where(p => p.DepartmentId == departmentId && p.IsActive)
            .OrderByDescending(p => p.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Project>> SearchAsync(string? name, short? status, int? departmentId)
    {
        var query = _dbSet
            .AsNoTracking()
            .Include(p => p.Department)
            .Where(p => p.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
        {
            var pattern = $"%{name.Trim().ToLower()}%";
            query = query.Where(p => EF.Functions.ILike(p.ProjectName, pattern));
        }

        if (status.HasValue)
        {
            query = query.Where(p => p.Status == status.Value);
        }

        if (departmentId.HasValue && departmentId.Value > 0)
        {
            query = query.Where(p => p.DepartmentId == departmentId.Value);
        }

        return await query.OrderByDescending(p => p.CreatedDate).ToListAsync();
    }

    public async Task<bool> HasTasksAsync(int projectId)
    {
        return await _context.Tasks.AnyAsync(t => t.ProjectId == projectId);
    }
}
