using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Interfaces;

public interface ITagService
{
    System.Threading.Tasks.Task<IEnumerable<TagDto>> GetAllAsync();
    System.Threading.Tasks.Task<TagDto?> GetByIdAsync(int id);
    System.Threading.Tasks.Task<ServiceResult<TagDto>> CreateAsync(TagCreateDto dto);
    System.Threading.Tasks.Task<ServiceResult<TagDto>> UpdateAsync(int id, TagUpdateDto dto);
    System.Threading.Tasks.Task<ServiceResult> DeleteAsync(int id);
}
