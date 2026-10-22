using System;
using System.Threading.Tasks;
using API.Hubs;
using Core.Application.Features.Guestbook.Commands;
using Core.Application.Features.Guestbook.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.RateLimiting; 

namespace API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class GuestbookController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IHubContext<PortfolioHub> _hubContext;

    public GuestbookController(IMediator mediator, IHubContext<PortfolioHub> hubContext)
    {
        _mediator = mediator;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllEntries()
    {
        var entries = await _mediator.Send(new GetAllGuestbookEntriesQuery());
        return Ok(entries);
    }

    [HttpPost]
    [EnableRateLimiting("StrictPolicy")]
    public async Task<IActionResult> CreateEntry([FromBody] CreateGuestbookEntryCommand command)
    {
        var createdEntry = await _mediator.Send(command);
        await _hubContext.Clients.All.SendAsync("ReceiveGuestbookEntry", createdEntry);
        return Ok(createdEntry);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteEntry(Guid id)
    {
        var result = await _mediator.Send(new DeleteGuestbookEntryCommand { Id = id });
        return result ? Ok(new { Message = "Guestbook entry deleted successfully." }) : BadRequest();
    }
}