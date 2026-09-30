using TaskTrack.Repo.Models;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Interfaces;

namespace TaskTrack.Service.Services;

public class TagService : ITagService
{
    private readonly IUnitOfWork _uow;

    public TagService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async System.Threading.Tasks.Task<IEnumerable<TagDto>> GetAllAsync()
    {
        var tags = await _uow.Tags.GetAllAsync();
        var result = new List<TagDto>();

        foreach (var tag in tags)
        {
            var taskCount = await _uow.TaskTags.CountAsync(tt => tt.TagId == tag.TagId);
            result.Add(new TagDto
            {
                TagId = tag.TagId,
                TagName = tag.TagName,
                Color = tag.Color,
                TaskCount = taskCount
            });
        }

        return result.OrderBy(t => t.TagName);
    }

    public async System.Threading.Tasks.Task<TagDto?> GetByIdAsync(int id)
    {
        var tag = await _uow.Tags.GetByIdAsync(id);
        if (tag == null)
            return null;

        var taskCount = await _uow.TaskTags.CountAsync(tt => tt.TagId == tag.TagId);
        return new TagDto
        {
            TagId = tag.TagId,
            TagName = tag.TagName,
            Color = tag.Color,
            TaskCount = taskCount
        };
    }

    public async System.Threading.Tasks.Task<ServiceResult<TagDto>> CreateAsync(TagCreateDto dto)
    {
        var nameExists = await _uow.Tags.ExistsAsync(t => t.TagName.ToLower() == dto.TagName.Trim().ToLower());
        if (nameExists)
            return ServiceResult<TagDto>.Fail($"A tag with name '{dto.TagName}' already exists.");

        var tag = new Tag
        {
            TagName = dto.TagName.Trim(),
            Color = dto.Color?.Trim()
        };

        await _uow.Tags.AddAsync(tag);
        await _uow.CompleteAsync();

        return ServiceResult<TagDto>.Ok(new TagDto
        {
            TagId = tag.TagId,
            TagName = tag.TagName,
            Color = tag.Color,
            TaskCount = 0
        });
    }

    public async System.Threading.Tasks.Task<ServiceResult<TagDto>> UpdateAsync(int id, TagUpdateDto dto)
    {
        var tag = await _uow.Tags.GetByIdAsync(id);
        if (tag == null)
            return ServiceResult<TagDto>.Fail("Tag not found");

        var duplicateName = await _uow.Tags.ExistsAsync(t => t.TagId != id && t.TagName.ToLower() == dto.TagName.Trim().ToLower());
        if (duplicateName)
            return ServiceResult<TagDto>.Fail($"A tag with name '{dto.TagName}' already exists.");

        tag.TagName = dto.TagName.Trim();
        tag.Color = dto.Color?.Trim();

        _uow.Tags.Update(tag);
        await _uow.CompleteAsync();

        var count = await _uow.TaskTags.CountAsync(tt => tt.TagId == tag.TagId);
        return ServiceResult<TagDto>.Ok(new TagDto
        {
            TagId = tag.TagId,
            TagName = tag.TagName,
            Color = tag.Color,
            TaskCount = count
        });
    }

    public async System.Threading.Tasks.Task<ServiceResult> DeleteAsync(int id)
    {
        var tag = await _uow.Tags.GetByIdAsync(id);
        if (tag == null)
            return ServiceResult.Fail("Tag not found");

        var isUsed = await _uow.Tags.IsUsedByAnyTaskAsync(id);
        if (isUsed)
            return ServiceResult.Fail("Cannot delete tag because it is currently assigned to one or more tasks.");

        _uow.Tags.Remove(tag);
        await _uow.CompleteAsync();

        return ServiceResult.Ok();
    }
}
