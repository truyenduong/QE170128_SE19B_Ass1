using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Interfaces;

public interface IProjectService
{
    System.Threading.Tasks.Task<IEnumerable<ProjectResponseDto>> GetAllActiveAsync();
    System.Threading.Tasks.Task<ProjectDetailDto?> GetByIdWithTasksAsync(int id);
    System.Threading.Tasks.Task<IEnumerable<ProjectResponseDto>> GetByDepartmentIdAsync(int departmentId);
    System.Threading.Tasks.Task<ServiceResult<ProjectResponseDto>> CreateAsync(ProjectCreateDto dto);
    System.Threading.Tasks.Task<ServiceResult<ProjectResponseDto>> UpdateAsync(int id, ProjectUpdateDto dto);
    System.Threading.Tasks.Task<ServiceResult> DeleteAsync(int id);
    System.Threading.Tasks.Task<IEnumerable<ProjectResponseDto>> SearchAsync(string? name, short? status, int? departmentId);
}
