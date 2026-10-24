using System;
using System.Threading.Tasks;
using API.Hubs;
using Core.Application.Features.Guestbook.Commands;
using Core.Application.Features.Guestbook.DTOs;
using Core.Application.Features.Guestbook.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.SignalR;

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

        var broadcastDto = new GuestbookEntryDto
        {
            Id = createdEntry.Id,
            ExplorerName = createdEntry.ExplorerName,
            GuildOrCompany = createdEntry.GuildOrCompany,
            Message = createdEntry.Message,
            CreatedAt = createdEntry.CreatedAt,
            UpdatedAt = createdEntry.UpdatedAt,
            AuthorToken = null
        };

        await _hubContext.Clients.All.SendAsync("ReceiveGuestbookEntry", broadcastDto);

        return Ok(createdEntry);
    }

    [HttpPut("{id:guid}")]
    [EnableRateLimiting("StrictPolicy")]
    public async Task<IActionResult> UpdateEntry(
        Guid id,
        [FromBody] UpdateGuestbookEntryRequestDto request,
        [FromHeader(Name = "X-Author-Token")] string? authorToken)
    {
        var isAdmin = User.Identity?.IsAuthenticated == true && User.IsInRole("Admin");

        var updatedEntry = await _mediator.Send(new UpdateGuestbookEntryCommand
        {
            Id = id,
            ExplorerName = request.ExplorerName,
            GuildOrCompany = request.GuildOrCompany,
            Message = request.Message,
            AuthorToken = authorToken,
            IsAdmin = isAdmin
        });

        await _hubContext.Clients.All.SendAsync("UpdateGuestbookEntry", updatedEntry);

        return Ok(updatedEntry);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEntry(
        Guid id,
        [FromHeader(Name = "X-Author-Token")] string? authorToken)
    {
        var isAdmin = User.Identity?.IsAuthenticated == true && User.IsInRole("Admin");

        var result = await _mediator.Send(new DeleteGuestbookEntryCommand
        {
            Id = id,
            AuthorToken = authorToken,
            IsAdmin = isAdmin
        });

        if (result)
        {
            await _hubContext.Clients.All.SendAsync("RemoveGuestbookEntry", id);
            return Ok(new { Message = "Guestbook entry deleted successfully." });
        }

        return BadRequest();
    }
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetEntryById(Guid id)
    {
        var entry = await _mediator.Send(new GetGuestbookEntryByIdQuery { Id = id });
        return Ok(entry);
    }
}