using TaskTrack.Repo.Models;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Interfaces;

namespace TaskTrack.Service.Services;

public class DepartmentService : IDepartmentService
{
    private readonly IUnitOfWork _uow;

    public DepartmentService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async System.Threading.Tasks.Task<IEnumerable<DepartmentResponseDto>> GetAllActiveAsync()
    {
        var departments = await _uow.Departments.FindAsync(d => d.IsActive);
        var result = new List<DepartmentResponseDto>();

        foreach (var d in departments)
        {
            var count = await _uow.Projects.CountAsync(p => p.DepartmentId == d.DepartmentId && p.IsActive);
            result.Add(new DepartmentResponseDto
            {
                DepartmentId = d.DepartmentId,
                DepartmentName = d.DepartmentName,
                DepartmentDescription = d.DepartmentDescription,
                IsActive = d.IsActive,
                ProjectCount = count
            });
        }

        return result.OrderBy(d => d.DepartmentId);
    }

    public async System.Threading.Tasks.Task<DepartmentDetailDto?> GetByIdWithProjectsAsync(int id)
    {
        var department = await _uow.Departments.GetByIdWithProjectsAsync(id);
        if (department == null)
            return null;

        return new DepartmentDetailDto
        {
            DepartmentId = department.DepartmentId,
            DepartmentName = department.DepartmentName,
            DepartmentDescription = department.DepartmentDescription,
            IsActive = department.IsActive,
            Projects = department.Projects.Select(p => new ProjectResponseDto
            {
                ProjectId = p.ProjectId,
                ProjectName = p.ProjectName,
                Description = p.Description,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Status = p.Status,
                DepartmentId = p.DepartmentId,
                DepartmentName = department.DepartmentName,
                IsActive = p.IsActive,
                CreatedDate = p.CreatedDate
            }).ToList()
        };
    }

    public async System.Threading.Tasks.Task<DepartmentResponseDto> CreateAsync(DepartmentCreateDto dto)
    {
        var department = new Department
        {
            DepartmentName = dto.DepartmentName.Trim(),
            DepartmentDescription = dto.DepartmentDescription.Trim(),
            IsActive = dto.IsActive
        };

        await _uow.Departments.AddAsync(department);
        await _uow.CompleteAsync();

        return new DepartmentResponseDto
        {
            DepartmentId = department.DepartmentId,
            DepartmentName = department.DepartmentName,
            DepartmentDescription = department.DepartmentDescription,
            IsActive = department.IsActive,
            ProjectCount = 0
        };
    }

    public async System.Threading.Tasks.Task<ServiceResult<DepartmentResponseDto>> UpdateAsync(int id, DepartmentUpdateDto dto)
    {
        var department = await _uow.Departments.GetByIdAsync(id);
        if (department == null)
            return ServiceResult<DepartmentResponseDto>.Fail("Department not found");

        department.DepartmentName = dto.DepartmentName.Trim();
        department.DepartmentDescription = dto.DepartmentDescription.Trim();
        department.IsActive = dto.IsActive;

        _uow.Departments.Update(department);
        await _uow.CompleteAsync();

        var count = await _uow.Projects.CountAsync(p => p.DepartmentId == department.DepartmentId && p.IsActive);

        return ServiceResult<DepartmentResponseDto>.Ok(new DepartmentResponseDto
        {
            DepartmentId = department.DepartmentId,
            DepartmentName = department.DepartmentName,
            DepartmentDescription = department.DepartmentDescription,
            IsActive = department.IsActive,
            ProjectCount = count
        });
    }

    public async System.Threading.Tasks.Task<ServiceResult> DeleteAsync(int id)
    {
        var department = await _uow.Departments.GetByIdAsync(id);
        if (department == null)
            return ServiceResult.Fail("Department not found");

        var hasProjects = await _uow.Departments.HasProjectsAsync(id);
        if (hasProjects)
            return ServiceResult.Fail("Cannot delete department because projects are linked to it.");

        _uow.Departments.Remove(department);
        await _uow.CompleteAsync();

        return ServiceResult.Ok();
    }

    public async System.Threading.Tasks.Task<IEnumerable<DepartmentResponseDto>> SearchByNameAsync(string name)
    {
        var departments = await _uow.Departments.SearchByNameAsync(name);
        var result = new List<DepartmentResponseDto>();

        foreach (var d in departments)
        {
            var count = await _uow.Projects.CountAsync(p => p.DepartmentId == d.DepartmentId && p.IsActive);
            result.Add(new DepartmentResponseDto
            {
                DepartmentId = d.DepartmentId,
                DepartmentName = d.DepartmentName,
                DepartmentDescription = d.DepartmentDescription,
                IsActive = d.IsActive,
                ProjectCount = count
            });
        }

        return result;
    }
}
