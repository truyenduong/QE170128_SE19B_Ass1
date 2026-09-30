using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TaskTrack.Repo.Models;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.Interfaces;
using TaskTrack.Service.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure listening port (support Render PORT env var)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// Determine connection string: Support Render DATABASE_URL or standard appsettings
string connectionString = GetPostgresConnectionString(builder.Configuration);

builder.Services.AddDbContext<TaskManagementDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// Dependency Injection - Unit of Work & Repositories
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();

// Dependency Injection - Services
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<ITagService, TagService>();

// CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];
        var originsFromEnvironment = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS");
        if (!string.IsNullOrWhiteSpace(originsFromEnvironment))
        {
            allowedOrigins = originsFromEnvironment.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
        }

        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Swagger / OpenAPI documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TaskTrack API - Task & Team Management",
        Version = "v1",
        Description = "PRN232 Assignment 1 — ASP.NET Core Web API with PostgreSQL backend."
    });
});

// Forwarded Headers for reverse proxies like Render
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedFor | Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

app.UseForwardedHeaders();

// Enable Swagger in all environments for grading / live evaluation
app.UseSwagger(c =>
{
    c.RouteTemplate = "swagger/{documentName}/swagger.json";
});

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskTrack API v1");
    c.RoutePrefix = "swagger";
});

// Redirect root to /swagger so both "/" and "/swagger" work seamlessly
app.MapGet("/", () => Results.Redirect("/swagger"));

app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

// Health check endpoint for Render deployment monitoring
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.Run();

// Helper to parse Render DATABASE_URL or standard connection strings
static string GetPostgresConnectionString(IConfiguration configuration)
{
    var databaseUrl = configuration["DATABASE_URL"];
    if (!string.IsNullOrEmpty(databaseUrl))
    {
        // Render format: postgres://user:password@host:port/database
        if (databaseUrl.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) ||
            databaseUrl.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
        {
            var uri = new Uri(databaseUrl);
            var userInfo = Uri.UnescapeDataString(uri.UserInfo);
            var separator = userInfo.IndexOf(':');
            var user = separator < 0 ? userInfo : userInfo[..separator];
            var password = separator < 0 ? "" : userInfo[(separator + 1)..];
            var host = uri.Host;
            var port = uri.Port > 0 ? uri.Port : 5432;
            var database = Uri.UnescapeDataString(uri.AbsolutePath.TrimStart('/'));

            return $"Host={host};Port={port};Database={database};Username={user};Password={password};SSL Mode=Require;Trust Server Certificate=true";
        }
        return databaseUrl;
    }

    return configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("Set DATABASE_URL or ConnectionStrings:DefaultConnection.");
}
