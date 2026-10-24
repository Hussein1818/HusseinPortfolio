using System.Threading.Tasks;
using Core.Application.Features.Profile.Commands;
using Core.Application.Features.Profile.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProfileController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var result = await _mediator.Send(new GetPortfolioProfileQuery());
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    [RequestSizeLimit(10_485_760)]
    public async Task<IActionResult> UpsertProfile([FromBody] UpsertPortfolioProfileCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}