using System.Security.Claims;
using System.Threading.Tasks;
using Core.Application.Features.Auth.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    [EnableRateLimiting("StrictPolicy")]
    public async Task<IActionResult> Login([FromBody] LoginQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("me")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var query = new GetCurrentUserQuery
        {
            UserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty,
            Email = User.FindFirstValue(ClaimTypes.Email) ?? string.Empty,
            Role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }
}