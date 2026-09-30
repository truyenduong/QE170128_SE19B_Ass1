using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Interfaces;

public interface ITaskService
{
    System.Threading.Tasks.Task<IEnumerable<TaskResponseDto>> GetAllActiveAsync();
    System.Threading.Tasks.Task<TaskResponseDto?> GetByIdWithTagsAsync(int id);
    System.Threading.Tasks.Task<IEnumerable<TaskResponseDto>> GetByProjectIdAsync(int projectId);
    System.Threading.Tasks.Task<ServiceResult<TaskResponseDto>> CreateAsync(TaskCreateDto dto);
    System.Threading.Tasks.Task<ServiceResult<TaskResponseDto>> UpdateAsync(int id, TaskUpdateDto dto);
    System.Threading.Tasks.Task<ServiceResult> SoftDeleteAsync(int id);
    System.Threading.Tasks.Task<IEnumerable<TaskResponseDto>> SearchAsync(string? title, short? status, short? priority, int? projectId, int? tagId);
}
