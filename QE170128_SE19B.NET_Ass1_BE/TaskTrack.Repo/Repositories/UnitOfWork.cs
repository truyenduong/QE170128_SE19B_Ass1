using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly TaskManagementDbContext _context;
    private IDepartmentRepository? _departments;
    private IProjectRepository? _projects;
    private ITaskRepository? _tasks;
    private ITagRepository? _tags;
    private IGenericRepository<TaskTag>? _taskTags;

    public UnitOfWork(TaskManagementDbContext context)
    {
        _context = context;
    }

    public IDepartmentRepository Departments => _departments ??= new DepartmentRepository(_context);
    public IProjectRepository Projects => _projects ??= new ProjectRepository(_context);
    public ITaskRepository Tasks => _tasks ??= new TaskRepository(_context);
    public ITagRepository Tags => _tags ??= new TagRepository(_context);
    public IGenericRepository<TaskTag> TaskTags => _taskTags ??= new GenericRepository<TaskTag>(_context);

    public async Task<int> CompleteAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
