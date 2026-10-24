using System;
using System.Threading.Tasks;
using Core.Application.Features.Challenge.Commands;
using Core.Application.Features.Challenge.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ChallengeController : ControllerBase
{
    private readonly IMediator _mediator;

    public ChallengeController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllActions()
    {
        var result = await _mediator.Send(new GetAllBossActionsQuery());
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetActionById(Guid id)
    {
        var result = await _mediator.Send(new GetBossActionByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateAction([FromBody] CreateBossActionCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetActionById), new { id }, new { Id = id });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAction(Guid id, [FromBody] UpdateBossActionCommand command)
    {
        if (id != command.Id)
            return BadRequest(new { Message = "Route ID does not match payload ID." });

        var result = await _mediator.Send(command);
        return result ? Ok(new { Message = "Challenge action updated successfully." }) : BadRequest();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAction(Guid id)
    {
        var result = await _mediator.Send(new DeleteBossActionCommand { Id = id });
        return result ? Ok(new { Message = "Challenge action deleted successfully." }) : BadRequest();
    }
}