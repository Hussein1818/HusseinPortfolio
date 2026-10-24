using System;

namespace Core.Application.Features.Profile.DTOs;

public class PortfolioProfileDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string GithubUrl { get; set; } = string.Empty;
    public string LinkedinUrl { get; set; } = string.Empty;
    public string DungeonAvatar { get; set; } = string.Empty;
    public string RecruiterAvatar { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string EducationDegree { get; set; } = string.Empty;
    public string EducationUniversity { get; set; } = string.Empty;
    public string EducationGrade { get; set; } = string.Empty;
    public string? CvFileUrl { get; set; }
}