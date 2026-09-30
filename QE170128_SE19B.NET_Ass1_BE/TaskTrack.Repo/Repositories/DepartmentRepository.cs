using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public class DepartmentRepository : GenericRepository<Department>, IDepartmentRepository
{
    public DepartmentRepository(TaskManagementDbContext context) : base(context)
    {
    }

    public async Task<Department?> GetByIdWithProjectsAsync(int id)
    {
        return await _dbSet
            .Include(d => d.Projects.Where(p => p.IsActive))
            .FirstOrDefaultAsync(d => d.DepartmentId == id);
    }

    public async Task<IEnumerable<Department>> SearchByNameAsync(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return await GetAllAsync();

        var pattern = $"%{name.Trim().ToLower()}%";
        return await _dbSet
            .AsNoTracking()
            .Where(d => EF.Functions.ILike(d.DepartmentName, pattern))
            .ToListAsync();
    }

    public async Task<bool> HasProjectsAsync(int departmentId)
    {
        return await _context.Projects.AnyAsync(p => p.DepartmentId == departmentId);
    }
}
