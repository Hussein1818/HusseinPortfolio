using System;
using System.Threading.Tasks;
using Core.Application.Features.Skills.Commands;
using Core.Application.Features.Skills.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SkillsController(IMediator mediator)
    {
        _mediator = mediator;
    }


    [HttpGet("categories")]
    public async Task<IActionResult> GetAllCategoriesWithSkills()
    {
        var result = await _mediator.Send(new GetAllSkillCategoriesQuery());
        return Ok(result);
    }

    [HttpGet("items")]
    public async Task<IActionResult> GetAllSkillItems()
    {
        var result = await _mediator.Send(new GetAllSkillItemsQuery());
        return Ok(result);
    }

    [HttpGet("categories/{categoryId:guid}/items")]
    public async Task<IActionResult> GetSkillsByCategoryId(Guid categoryId)
    {
        var result = await _mediator.Send(new GetSkillsByCategoryIdQuery { CategoryId = categoryId });
        return Ok(result);
    }

    [HttpGet("items/{id:guid}")]
    public async Task<IActionResult> GetSkillItemById(Guid id)
    {
        var result = await _mediator.Send(new GetSkillItemByIdQuery { Id = id });
        return Ok(result);
    }


    [HttpPost("categories")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateSkillCategoryCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { Id = id, Message = "Skill category created successfully." });
    }

    [HttpPut("categories/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] UpdateSkillCategoryCommand command)
    {
        if (id != command.Id)
            return BadRequest(new { Message = "Route ID does not match payload ID." });

        var result = await _mediator.Send(command);
        return result ? Ok(new { Message = "Skill category updated successfully." }) : BadRequest();
    }

    [HttpDelete("categories/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var result = await _mediator.Send(new DeleteSkillCategoryCommand { Id = id });
        return result ? Ok(new { Message = "Skill category deleted successfully." }) : BadRequest();
    }

    [HttpPost("items")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateSkillItem([FromBody] CreateSkillItemCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetSkillItemById), new { id }, new { Id = id });
    }

    [HttpPut("items/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateSkillItem(Guid id, [FromBody] UpdateSkillItemCommand command)
    {
        if (id != command.Id)
            return BadRequest(new { Message = "Route ID does not match payload ID." });

        var result = await _mediator.Send(command);
        return result ? Ok(new { Message = "Skill item updated successfully." }) : BadRequest();
    }

    [HttpDelete("items/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteSkillItem(Guid id)
    {
        var result = await _mediator.Send(new DeleteSkillItemCommand { Id = id });
        return result ? Ok(new { Message = "Skill item deleted successfully." }) : BadRequest();
    }
    [HttpGet("categories/{id:guid}")]
    public async Task<IActionResult> GetCategoryById(Guid id)
    {
        var result = await _mediator.Send(new GetSkillCategoryByIdQuery { Id = id });
        return Ok(result);
    }
}