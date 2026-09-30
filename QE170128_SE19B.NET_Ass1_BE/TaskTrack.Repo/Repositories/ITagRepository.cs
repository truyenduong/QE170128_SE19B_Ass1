using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public interface ITagRepository : IGenericRepository<Tag>
{
    Task<bool> IsUsedByAnyTaskAsync(int tagId);
}
