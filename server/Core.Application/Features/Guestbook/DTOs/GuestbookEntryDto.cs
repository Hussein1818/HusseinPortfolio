using System;

namespace Core.Application.Features.Guestbook.DTOs;

public class GuestbookEntryDto
{
    public Guid Id { get; set; }
    public string ExplorerName { get; set; } = string.Empty;
    public string GuildOrCompany { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}