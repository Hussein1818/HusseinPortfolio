using Core.Domain.Common;

namespace Core.Domain.Entities;

public class BossAction : BaseEntity
{
    public string Label { get; set; } = string.Empty;
    public string ProjectOrigin { get; set; } = string.Empty;
    public string ImpactDescription { get; set; } = string.Empty;
    public int Damage { get; set; }
}