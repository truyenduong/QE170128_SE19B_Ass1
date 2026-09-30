namespace TaskTrack.Repo.Models;

public partial class TaskTag
{
    public int TaskId { get; set; }

    public int TagId { get; set; }

    public virtual Task Task { get; set; } = null!;

    public virtual Tag Tag { get; set; } = null!;
}
