using TaskTrack.Repo.Models;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Interfaces;

namespace TaskTrack.Service.Services;

public class ProjectService : IProjectService
{
    private readonly IUnitOfWork _uow;

    public ProjectService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async System.Threading.Tasks.Task<IEnumerable<ProjectResponseDto>> GetAllActiveAsync()
    {
        var projects = await _uow.Projects.GetAllWithDepartmentAsync();
        var result = new List<ProjectResponseDto>();

        foreach (var p in projects)
        {
            var taskCount = await _uow.Tasks.CountAsync(t => t.ProjectId == p.ProjectId && t.IsActive);
            result.Add(MapToResponseDto(p, taskCount));
        }

        return result;
    }

    public async System.Threading.Tasks.Task<ProjectDetailDto?> GetByIdWithTasksAsync(int id)
    {
        var p = await _uow.Projects.GetByIdWithTasksAsync(id);
        if (p == null)
            return null;

        return new ProjectDetailDto
        {
            ProjectId = p.ProjectId,
            ProjectName = p.ProjectName,
            Description = p.Description,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            Status = p.Status,
            DepartmentId = p.DepartmentId,
            DepartmentName = p.Department?.DepartmentName ?? string.Empty,
            IsActive = p.IsActive,
            CreatedDate = p.CreatedDate,
            Tasks = p.Tasks.Select(t => new TaskResponseDto
            {
                TaskId = t.TaskId,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                DueDate = t.DueDate,
                ProjectId = t.ProjectId,
                ProjectName = p.ProjectName,
                DepartmentId = p.DepartmentId,
                DepartmentName = p.Department?.DepartmentName ?? string.Empty,
                IsActive = t.IsActive,
                CreatedDate = t.CreatedDate,
                ModifiedDate = t.ModifiedDate,
                Tags = t.TaskTags.Select(tt => new TagDto
                {
                    TagId = tt.Tag.TagId,
                    TagName = tt.Tag.TagName,
                    Color = tt.Tag.Color
                }).ToList()
            }).ToList()
        };
    }

    public async System.Threading.Tasks.Task<IEnumerable<ProjectResponseDto>> GetByDepartmentIdAsync(int departmentId)
    {
        var projects = await _uow.Projects.GetByDepartmentIdAsync(departmentId);
        var result = new List<ProjectResponseDto>();

        foreach (var p in projects)
        {
            var taskCount = await _uow.Tasks.CountAsync(t => t.ProjectId == p.ProjectId && t.IsActive);
            result.Add(MapToResponseDto(p, taskCount));
        }

        return result;
    }

    public async System.Threading.Tasks.Task<ServiceResult<ProjectResponseDto>> CreateAsync(ProjectCreateDto dto)
    {
        var department = await _uow.Departments.GetByIdAsync(dto.DepartmentId);
        if (department == null)
            return ServiceResult<ProjectResponseDto>.Fail("Department not found");

        var project = new Project
        {
            ProjectName = dto.ProjectName.Trim(),
            Description = dto.Description?.Trim(),
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = dto.Status,
            DepartmentId = dto.DepartmentId,
            IsActive = dto.IsActive,
            CreatedDate = DateTime.UtcNow
        };

        await _uow.Projects.AddAsync(project);
        await _uow.CompleteAsync();

        return ServiceResult<ProjectResponseDto>.Ok(new ProjectResponseDto
        {
            ProjectId = project.ProjectId,
            ProjectName = project.ProjectName,
            Description = project.Description,
            StartDate = project.StartDate,
            EndDate = project.EndDate,
            Status = project.Status,
            DepartmentId = project.DepartmentId,
            DepartmentName = department.DepartmentName,
            IsActive = project.IsActive,
            CreatedDate = project.CreatedDate,
            TaskCount = 0
        });
    }

    public async System.Threading.Tasks.Task<ServiceResult<ProjectResponseDto>> UpdateAsync(int id, ProjectUpdateDto dto)
    {
        var project = await _uow.Projects.GetByIdAsync(id);
        if (project == null)
            return ServiceResult<ProjectResponseDto>.Fail("Project not found");

        var department = await _uow.Departments.GetByIdAsync(dto.DepartmentId);
        if (department == null)
            return ServiceResult<ProjectResponseDto>.Fail("Department not found");

        project.ProjectName = dto.ProjectName.Trim();
        project.Description = dto.Description?.Trim();
        project.StartDate = dto.StartDate;
        project.EndDate = dto.EndDate;
        project.Status = dto.Status;
        project.DepartmentId = dto.DepartmentId;
        project.IsActive = dto.IsActive;

        _uow.Projects.Update(project);
        await _uow.CompleteAsync();

        var taskCount = await _uow.Tasks.CountAsync(t => t.ProjectId == project.ProjectId && t.IsActive);

        return ServiceResult<ProjectResponseDto>.Ok(new ProjectResponseDto
        {
            ProjectId = project.ProjectId,
            ProjectName = project.ProjectName,
            Description = project.Description,
            StartDate = project.StartDate,
            EndDate = project.EndDate,
            Status = project.Status,
            DepartmentId = project.DepartmentId,
            DepartmentName = department.DepartmentName,
            IsActive = project.IsActive,
            CreatedDate = project.CreatedDate,
            TaskCount = taskCount
        });
    }

    public async System.Threading.Tasks.Task<ServiceResult> DeleteAsync(int id)
    {
        var project = await _uow.Projects.GetByIdAsync(id);
        if (project == null)
            return ServiceResult.Fail("Project not found");

        var hasTasks = await _uow.Projects.HasTasksAsync(id);
        if (hasTasks)
            return ServiceResult.Fail("Cannot delete project because tasks are linked to it.");

        _uow.Projects.Remove(project);
        await _uow.CompleteAsync();

        return ServiceResult.Ok();
    }

    public async System.Threading.Tasks.Task<IEnumerable<ProjectResponseDto>> SearchAsync(string? name, short? status, int? departmentId)
    {
        var projects = await _uow.Projects.SearchAsync(name, status, departmentId);
        var result = new List<ProjectResponseDto>();

        foreach (var p in projects)
        {
            var taskCount = await _uow.Tasks.CountAsync(t => t.ProjectId == p.ProjectId && t.IsActive);
            result.Add(MapToResponseDto(p, taskCount));
        }

        return result;
    }

    private static ProjectResponseDto MapToResponseDto(Project p, int taskCount)
    {
        return new ProjectResponseDto
        {
            ProjectId = p.ProjectId,
            ProjectName = p.ProjectName,
            Description = p.Description,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            Status = p.Status,
            DepartmentId = p.DepartmentId,
            DepartmentName = p.Department?.DepartmentName ?? string.Empty,
            IsActive = p.IsActive,
            CreatedDate = p.CreatedDate,
            TaskCount = taskCount
        };
    }
}
