using Core.Domain.Common;

namespace Core.Domain.Entities;

public class GuestbookEntry : BaseEntity
{
    public string ExplorerName { get; set; } = string.Empty;
    public string GuildOrCompany { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string AuthorTokenHash { get; set; } = string.Empty;
}