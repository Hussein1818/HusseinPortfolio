using Core.Application.Features.Projects.Commands;
using Core.Application.Features.Projects.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProjectsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProjects()
    {
        var query = new GetAllProjectsQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProjectById(Guid id)
    {
        var query = new GetProjectByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectCommand command)
    {
        var projectId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetProjectById), new { id = projectId }, projectId);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProject(Guid id, [FromBody] UpdateProjectCommand command)
    {
        if (id != command.Id)
            return BadRequest(new { Message = "Route ID does not match payload ID." });

        var result = await _mediator.Send(command);
        return result ? Ok(new { Message = "Project updated successfully." }) : BadRequest();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        var command = new DeleteProjectCommand { Id = id };
        var result = await _mediator.Send(command);
        return result ? Ok(new { Message = "Project deleted successfully." }) : BadRequest();
    }
}