using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public class TagRepository : GenericRepository<Tag>, ITagRepository
{
    public TagRepository(TaskManagementDbContext context) : base(context)
    {
    }

    public async Task<bool> IsUsedByAnyTaskAsync(int tagId)
    {
        return await _context.TaskTags.AnyAsync(tt => tt.TagId == tagId);
    }
}
