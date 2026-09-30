using Microsoft.AspNetCore.Mvc;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Interfaces;

namespace TaskTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentService _departmentService;

    public DepartmentsController(IDepartmentService departmentService)
    {
        _departmentService = departmentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var departments = await _departmentService.GetAllActiveAsync();
        return Ok(departments);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string? name)
    {
        var results = await _departmentService.SearchByNameAsync(name ?? string.Empty);
        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var department = await _departmentService.GetByIdWithProjectsAsync(id);
        if (department == null)
            return NotFound(new { message = $"Department with ID {id} not found." });

        return Ok(department);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] DepartmentCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _departmentService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.DepartmentId }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] DepartmentUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _departmentService.UpdateAsync(id, dto);
        if (!result.Success)
            return BadRequest(new { message = result.ErrorMessage });

        return Ok(result.Data);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _departmentService.DeleteAsync(id);
        if (!result.Success)
            return BadRequest(new { message = result.ErrorMessage });

        return NoContent();
    }
}
