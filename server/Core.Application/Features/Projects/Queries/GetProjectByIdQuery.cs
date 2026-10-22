using AutoMapper;
using Core.Application.Features.Projects.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;
using System;

namespace Core.Application.Features.Projects.Queries;

public class GetProjectByIdQuery : IRequest<ProjectDto>
{
    public Guid Id { get; set; }
}
public class GetProjectByIdQueryHandler : IRequestHandler<GetProjectByIdQuery, ProjectDto>
{
    private readonly IGenericRepository<Project> _projectRepository;
    private readonly IGenericRepository<ProjectSpec> _specRepository;
    private readonly IGenericRepository<ProjectTechStack> _techStackRepository;

    public GetProjectByIdQueryHandler(
        IGenericRepository<Project> projectRepository,
        IGenericRepository<ProjectSpec> specRepository,
        IGenericRepository<ProjectTechStack> techStackRepository)
    {
        _projectRepository = projectRepository;
        _specRepository = specRepository;
        _techStackRepository = techStackRepository;
    }

    public async Task<ProjectDto> Handle(GetProjectByIdQuery request, CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);

        if (project == null)
            throw new KeyNotFoundException($"Project with ID {request.Id} was not found.");

        var specs = await _specRepository.FindAsync(s => s.ProjectId == project.Id, cancellationToken);
        var techs = await _techStackRepository.FindAsync(t => t.ProjectId == project.Id, cancellationToken);

        return new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Role = project.Role,
            Period = project.Period,
            Type = project.Type,
            ImageUrl = project.ImageUrl,
            SecretArchitecture = project.SecretArchitecture,
            SchemaDiagram = project.SchemaDiagram,
            Description = project.Description,
            LiveUrl = project.LiveUrl,
            DeepDiveSpecs = specs.Select(s => s.Specification).ToList(),
            TechStacks = techs.Select(t => t.TechnologyName).ToList()
        };
    }
}