using Microsoft.AspNetCore.Identity;

namespace Core.Domain.Entities.Identity;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
}