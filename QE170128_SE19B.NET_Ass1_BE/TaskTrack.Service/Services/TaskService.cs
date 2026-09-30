using TaskTrack.Repo.Models;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Interfaces;
using TaskItem = TaskTrack.Repo.Models.Task;

namespace TaskTrack.Service.Services;

public class TaskService : ITaskService
{
    private readonly IUnitOfWork _uow;

    public TaskService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskResponseDto>> GetAllActiveAsync()
    {
        var tasks = await _uow.Tasks.GetAllActiveWithDetailsAsync();
        return tasks.Select(MapToResponseDto);
    }

    public async System.Threading.Tasks.Task<TaskResponseDto?> GetByIdWithTagsAsync(int id)
    {
        var task = await _uow.Tasks.GetByIdWithTagsAsync(id);
        return task == null ? null : MapToResponseDto(task);
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskResponseDto>> GetByProjectIdAsync(int projectId)
    {
        var tasks = await _uow.Tasks.GetByProjectIdAsync(projectId);
        var project = await _uow.Projects.GetByIdAsync(projectId);
        return tasks.Select(t =>
        {
            var dto = MapToResponseDto(t);
            dto.ProjectName = project?.ProjectName ?? string.Empty;
            return dto;
        });
    }

    public async System.Threading.Tasks.Task<ServiceResult<TaskResponseDto>> CreateAsync(TaskCreateDto dto)
    {
        var project = await _uow.Projects.GetByIdAsync(dto.ProjectId);
        if (project == null)
            return ServiceResult<TaskResponseDto>.Fail("Project not found");

        var task = new TaskItem
        {
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            Status = dto.Status,
            Priority = dto.Priority,
            DueDate = dto.DueDate,
            ProjectId = dto.ProjectId,
            IsActive = true,
            CreatedDate = DateTime.UtcNow
        };

        if (dto.TagIds != null && dto.TagIds.Any())
        {
            var uniqueTagIds = dto.TagIds.Distinct().ToList();
            foreach (var tagId in uniqueTagIds)
            {
                var tagExists = await _uow.Tags.ExistsAsync(t => t.TagId == tagId);
                if (tagExists)
                {
                    task.TaskTags.Add(new TaskTag { TagId = tagId });
                }
            }
        }

        await _uow.Tasks.AddAsync(task);
        await _uow.CompleteAsync();

        // Fetch refreshed entity with navigations
        var created = await _uow.Tasks.GetByIdWithTagsAsync(task.TaskId);
        return ServiceResult<TaskResponseDto>.Ok(MapToResponseDto(created!));
    }

    public async System.Threading.Tasks.Task<ServiceResult<TaskResponseDto>> UpdateAsync(int id, TaskUpdateDto dto)
    {
        var task = await _uow.Tasks.GetByIdWithTagsAsync(id);
        if (task == null)
            return ServiceResult<TaskResponseDto>.Fail("Task not found");

        var project = await _uow.Projects.GetByIdAsync(dto.ProjectId);
        if (project == null)
            return ServiceResult<TaskResponseDto>.Fail("Project not found");

        task.Title = dto.Title.Trim();
        task.Description = dto.Description?.Trim();
        task.Status = dto.Status;
        task.Priority = dto.Priority;
        task.DueDate = dto.DueDate;
        task.ProjectId = dto.ProjectId;
        task.IsActive = dto.IsActive;
        task.ModifiedDate = DateTime.UtcNow;

        // Replace tags
        var currentTags = task.TaskTags.ToList();
        foreach (var tt in currentTags)
        {
            _uow.TaskTags.Remove(tt);
        }

        if (dto.TagIds != null && dto.TagIds.Any())
        {
            var uniqueTagIds = dto.TagIds.Distinct().ToList();
            foreach (var tagId in uniqueTagIds)
            {
                var tagExists = await _uow.Tags.ExistsAsync(t => t.TagId == tagId);
                if (tagExists)
                {
                    task.TaskTags.Add(new TaskTag { TaskId = task.TaskId, TagId = tagId });
                }
            }
        }

        _uow.Tasks.Update(task);
        await _uow.CompleteAsync();

        var updated = await _uow.Tasks.GetByIdWithTagsAsync(task.TaskId);
        return ServiceResult<TaskResponseDto>.Ok(MapToResponseDto(updated!));
    }

    public async System.Threading.Tasks.Task<ServiceResult> SoftDeleteAsync(int id)
    {
        var task = await _uow.Tasks.GetByIdAsync(id);
        if (task == null)
            return ServiceResult.Fail("Task not found");

        task.IsActive = false;
        task.ModifiedDate = DateTime.UtcNow;

        _uow.Tasks.Update(task);
        await _uow.CompleteAsync();

        return ServiceResult.Ok();
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskResponseDto>> SearchAsync(string? title, short? status, short? priority, int? projectId, int? tagId)
    {
        var tasks = await _uow.Tasks.SearchAsync(title, status, priority, projectId, tagId);
        return tasks.Select(MapToResponseDto);
    }

    private static TaskResponseDto MapToResponseDto(TaskItem t)
    {
        return new TaskResponseDto
        {
            TaskId = t.TaskId,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            Priority = t.Priority,
            DueDate = t.DueDate,
            ProjectId = t.ProjectId,
            ProjectName = t.Project?.ProjectName ?? string.Empty,
            DepartmentId = t.Project?.DepartmentId,
            DepartmentName = t.Project?.Department?.DepartmentName ?? string.Empty,
            IsActive = t.IsActive,
            CreatedDate = t.CreatedDate,
            ModifiedDate = t.ModifiedDate,
            Tags = t.TaskTags.Select(tt => new TagDto
            {
                TagId = tt.Tag.TagId,
                TagName = tt.Tag.TagName,
                Color = tt.Tag.Color
            }).ToList()
        };
    }
}
