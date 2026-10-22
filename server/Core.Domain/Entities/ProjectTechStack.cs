using System;
using Core.Domain.Common;

namespace Core.Domain.Entities;

public class ProjectTechStack : BaseEntity
{
    public Guid ProjectId { get; set; }
    public string TechnologyName { get; set; } = string.Empty;

    // Navigation property
    public virtual Project? Project { get; set; }
}