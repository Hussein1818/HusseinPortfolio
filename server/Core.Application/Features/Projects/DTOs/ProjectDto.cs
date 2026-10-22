using System;
using System.Collections.Generic;

namespace Core.Application.Features.Projects.DTOs;

public class ProjectDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string SecretArchitecture { get; set; } = string.Empty;
    public string SchemaDiagram { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? LiveUrl { get; set; }
    public List<string> DeepDiveSpecs { get; set; } = new();
    public List<string> TechStacks { get; set; } = new();
}