using Microsoft.EntityFrameworkCore;

namespace TaskTrack.Repo.Models;

public partial class TaskManagementDbContext : DbContext
{
    public TaskManagementDbContext()
    {
    }

    public TaskManagementDbContext(DbContextOptions<TaskManagementDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Department> Departments { get; set; } = null!;
    public virtual DbSet<Project> Projects { get; set; } = null!;
    public virtual DbSet<Task> Tasks { get; set; } = null!;
    public virtual DbSet<Tag> Tags { get; set; } = null!;
    public virtual DbSet<TaskTag> TaskTags { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Department>(entity =>
        {
            entity.ToTable("Department");

            entity.HasKey(e => e.DepartmentId);

            entity.Property(e => e.DepartmentId).HasColumnName("DepartmentID");
            entity.Property(e => e.DepartmentName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.DepartmentDescription).HasMaxLength(300).IsRequired();
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.ToTable("Project");

            entity.HasKey(e => e.ProjectId);

            entity.Property(e => e.ProjectId).HasColumnName("ProjectID");
            entity.Property(e => e.ProjectName).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.StartDate).IsRequired();
            entity.Property(e => e.EndDate);
            entity.Property(e => e.Status).HasDefaultValue((short)0);
            entity.Property(e => e.DepartmentId).HasColumnName("DepartmentID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.Department)
                .WithMany(p => p.Projects)
                .HasForeignKey(d => d.DepartmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Project_Department");
        });

        modelBuilder.Entity<Task>(entity =>
        {
            entity.ToTable("Task");

            entity.HasKey(e => e.TaskId);

            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.Title).HasMaxLength(300).IsRequired();
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.Status).HasDefaultValue((short)0);
            entity.Property(e => e.Priority).HasDefaultValue((short)1);
            entity.Property(e => e.DueDate);
            entity.Property(e => e.ProjectId).HasColumnName("ProjectID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.ModifiedDate);

            entity.HasOne(d => d.Project)
                .WithMany(p => p.Tasks)
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Task_Project");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.ToTable("Tag");

            entity.HasKey(e => e.TagId);

            entity.HasIndex(e => e.TagName).IsUnique();

            entity.Property(e => e.TagId).HasColumnName("TagID");
            entity.Property(e => e.TagName).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Color).HasMaxLength(7);
        });

        modelBuilder.Entity<TaskTag>(entity =>
        {
            entity.ToTable("TaskTag");

            entity.HasKey(e => new { e.TaskId, e.TagId }).HasName("PK_TaskTag");

            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.TagId).HasColumnName("TagID");

            entity.HasOne(d => d.Task)
                .WithMany(p => p.TaskTags)
                .HasForeignKey(d => d.TaskId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TaskTag_Task");

            entity.HasOne(d => d.Tag)
                .WithMany(p => p.TaskTags)
                .HasForeignKey(d => d.TagId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TaskTag_Tag");
        });
    }
}
