namespace TaskTrack.Repo.Models;

public partial class Tag
{
    public int TagId { get; set; }

    public string TagName { get; set; } = null!;

    public string? Color { get; set; }

    public virtual ICollection<TaskTag> TaskTags { get; set; } = new List<TaskTag>();
}
