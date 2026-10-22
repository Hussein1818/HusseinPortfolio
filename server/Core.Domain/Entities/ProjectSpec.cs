using System;
using Core.Domain.Common;

namespace Core.Domain.Entities;

public class ProjectSpec : BaseEntity
{
    public Guid ProjectId { get; set; }
    public string Specification { get; set; } = string.Empty;

    // Navigation property
    public virtual Project? Project { get; set; }
}