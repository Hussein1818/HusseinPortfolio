namespace Core.Application.Features.Guestbook.DTOs;

public class UpdateGuestbookEntryRequestDto
{
    public string ExplorerName { get; set; } = string.Empty;
    public string GuildOrCompany { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}