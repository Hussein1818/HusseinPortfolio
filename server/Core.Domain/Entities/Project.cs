using System;
using System.Collections.Generic;
using Core.Domain.Common;

namespace Core.Domain.Entities;

public class Project : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string SecretArchitecture { get; set; } = string.Empty;
    public string SchemaDiagram { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? LiveUrl { get; set; }

    // Navigation properties
    public virtual ICollection<ProjectSpec> DeepDiveSpecs { get; set; } = new List<ProjectSpec>();
    public virtual ICollection<ProjectTechStack> TechStacks { get; set; } = new List<ProjectTechStack>();
}