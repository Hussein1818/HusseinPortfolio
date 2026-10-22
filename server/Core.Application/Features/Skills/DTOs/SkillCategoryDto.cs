using System;
using System.Collections.Generic;

namespace Core.Application.Features.Skills.DTOs;

public class SkillCategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string RuneSymbol { get; set; } = string.Empty;
    public List<SkillItemDto> Skills { get; set; } = new();
}