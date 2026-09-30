using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Interfaces;

public interface IDepartmentService
{
    System.Threading.Tasks.Task<IEnumerable<DepartmentResponseDto>> GetAllActiveAsync();
    System.Threading.Tasks.Task<DepartmentDetailDto?> GetByIdWithProjectsAsync(int id);
    System.Threading.Tasks.Task<DepartmentResponseDto> CreateAsync(DepartmentCreateDto dto);
    System.Threading.Tasks.Task<ServiceResult<DepartmentResponseDto>> UpdateAsync(int id, DepartmentUpdateDto dto);
    System.Threading.Tasks.Task<ServiceResult> DeleteAsync(int id);
    System.Threading.Tasks.Task<IEnumerable<DepartmentResponseDto>> SearchByNameAsync(string name);
}
