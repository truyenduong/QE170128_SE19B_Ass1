using System.ComponentModel.DataAnnotations;

namespace TaskTrack.Service.DTOs;

public class DepartmentResponseDto
{
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = null!;
    public string DepartmentDescription { get; set; } = null!;
    public bool IsActive { get; set; }
    public int ProjectCount { get; set; }
}

public class DepartmentDetailDto
{
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = null!;
    public string DepartmentDescription { get; set; } = null!;
    public bool IsActive { get; set; }
    public List<ProjectResponseDto> Projects { get; set; } = new();
}

public class DepartmentCreateDto
{
    [Required(ErrorMessage = "DepartmentName is required")]
    [MaxLength(100, ErrorMessage = "DepartmentName cannot exceed 100 characters")]
    public string DepartmentName { get; set; } = null!;

    [Required(ErrorMessage = "DepartmentDescription is required")]
    [MaxLength(300, ErrorMessage = "DepartmentDescription cannot exceed 300 characters")]
    public string DepartmentDescription { get; set; } = null!;

    public bool IsActive { get; set; } = true;
}

public class DepartmentUpdateDto
{
    [Required(ErrorMessage = "DepartmentName is required")]
    [MaxLength(100, ErrorMessage = "DepartmentName cannot exceed 100 characters")]
    public string DepartmentName { get; set; } = null!;

    [Required(ErrorMessage = "DepartmentDescription is required")]
    [MaxLength(300, ErrorMessage = "DepartmentDescription cannot exceed 300 characters")]
    public string DepartmentDescription { get; set; } = null!;

    public bool IsActive { get; set; } = true;
}
