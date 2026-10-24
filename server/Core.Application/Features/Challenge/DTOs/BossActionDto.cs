using System;

namespace Core.Application.Features.Challenge.DTOs;

public class BossActionDto
{
    public Guid Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string ProjectOrigin { get; set; } = string.Empty;
    public string ImpactDescription { get; set; } = string.Empty;
    public int Damage { get; set; }
}