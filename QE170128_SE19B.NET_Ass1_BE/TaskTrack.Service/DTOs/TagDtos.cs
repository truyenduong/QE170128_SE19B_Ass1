using System.ComponentModel.DataAnnotations;

namespace TaskTrack.Service.DTOs;

public class TagDto
{
    public int TagId { get; set; }
    public string TagName { get; set; } = null!;
    public string? Color { get; set; }
    public int TaskCount { get; set; }
}

public class TagCreateDto
{
    [Required(ErrorMessage = "TagName is required")]
    [MaxLength(50, ErrorMessage = "TagName cannot exceed 50 characters")]
    public string TagName { get; set; } = null!;

    [MaxLength(7, ErrorMessage = "Color must be a valid hex code (e.g. #3B82F6)")]
    public string? Color { get; set; }
}

public class TagUpdateDto
{
    [Required(ErrorMessage = "TagName is required")]
    [MaxLength(50, ErrorMessage = "TagName cannot exceed 50 characters")]
    public string TagName { get; set; } = null!;

    [MaxLength(7, ErrorMessage = "Color must be a valid hex code (e.g. #3B82F6)")]
    public string? Color { get; set; }
}
