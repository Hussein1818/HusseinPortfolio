using System;

namespace Core.Application.Features.Skills.DTOs;

public class SkillItemDto
{
    public Guid Id { get; set; }
    public Guid SkillCategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
}