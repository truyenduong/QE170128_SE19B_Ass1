using System.ComponentModel.DataAnnotations;

namespace TaskTrack.Service.DTOs;

public class ProjectResponseDto
{
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = null!;
    public string? Description { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public short Status { get; set; }
    public string StatusName => Status switch
    {
        0 => "Not Started",
        1 => "In Progress",
        2 => "Completed",
        3 => "On Hold",
        _ => "Unknown"
    };
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public int TaskCount { get; set; }
}

public class ProjectDetailDto
{
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = null!;
    public string? Description { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public short Status { get; set; }
    public string StatusName => Status switch
    {
        0 => "Not Started",
        1 => "In Progress",
        2 => "Completed",
        3 => "On Hold",
        _ => "Unknown"
    };
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public List<TaskResponseDto> Tasks { get; set; } = new();
}

public class ProjectCreateDto
{
    [Required(ErrorMessage = "ProjectName is required")]
    [MaxLength(200, ErrorMessage = "ProjectName cannot exceed 200 characters")]
    public string ProjectName { get; set; } = null!;

    public string? Description { get; set; }

    [Required(ErrorMessage = "StartDate is required")]
    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    [Range(0, 3, ErrorMessage = "Status must be between 0 (Not Started) and 3 (On Hold)")]
    public short Status { get; set; } = 0;

    [Required(ErrorMessage = "DepartmentId is required")]
    [Range(1, int.MaxValue, ErrorMessage = "A valid DepartmentId is required")]
    public int DepartmentId { get; set; }

    public bool IsActive { get; set; } = true;
}

public class ProjectUpdateDto
{
    [Required(ErrorMessage = "ProjectName is required")]
    [MaxLength(200, ErrorMessage = "ProjectName cannot exceed 200 characters")]
    public string ProjectName { get; set; } = null!;

    public string? Description { get; set; }

    [Required(ErrorMessage = "StartDate is required")]
    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    [Range(0, 3, ErrorMessage = "Status must be between 0 (Not Started) and 3 (On Hold)")]
    public short Status { get; set; }

    [Required(ErrorMessage = "DepartmentId is required")]
    [Range(1, int.MaxValue, ErrorMessage = "A valid DepartmentId is required")]
    public int DepartmentId { get; set; }

    public bool IsActive { get; set; } = true;
}
