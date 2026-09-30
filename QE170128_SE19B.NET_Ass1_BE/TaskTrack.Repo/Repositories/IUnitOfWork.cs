using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public interface IUnitOfWork : IDisposable
{
    IDepartmentRepository Departments { get; }
    IProjectRepository Projects { get; }
    ITaskRepository Tasks { get; }
    ITagRepository Tags { get; }
    IGenericRepository<TaskTag> TaskTags { get; }

    Task<int> CompleteAsync();
}
