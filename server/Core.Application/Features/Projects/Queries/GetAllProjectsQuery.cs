using AutoMapper;
using Core.Application.Features.Projects.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;
using System.Collections.Generic;

namespace Core.Application.Features.Projects.Queries;

public class GetAllProjectsQuery : IRequest<IReadOnlyList<ProjectDto>>
{
}
public class GetAllProjectsQueryHandler : IRequestHandler<GetAllProjectsQuery, IReadOnlyList<ProjectDto>>
{
    private readonly IGenericRepository<Project> _projectRepository;
    private readonly IGenericRepository<ProjectSpec> _specRepository;
    private readonly IGenericRepository<ProjectTechStack> _techStackRepository;

    public GetAllProjectsQueryHandler(
        IGenericRepository<Project> projectRepository,
        IGenericRepository<ProjectSpec> specRepository,
        IGenericRepository<ProjectTechStack> techStackRepository)
    {
        _projectRepository = projectRepository;
        _specRepository = specRepository;
        _techStackRepository = techStackRepository;
    }

    public async Task<IReadOnlyList<ProjectDto>> Handle(GetAllProjectsQuery request, CancellationToken cancellationToken)
    {
        var projects = await _projectRepository.GetAllAsync(cancellationToken);
        var allSpecs = await _specRepository.GetAllAsync(cancellationToken);
        var allTechs = await _techStackRepository.GetAllAsync(cancellationToken);

        return projects.Select(p => new ProjectDto
        {
            Id = p.Id,
            Name = p.Name,
            Role = p.Role,
            Period = p.Period,
            Type = p.Type,
            ImageUrl = p.ImageUrl,
            SecretArchitecture = p.SecretArchitecture,
            SchemaDiagram = p.SchemaDiagram,
            Description = p.Description,
            LiveUrl = p.LiveUrl,
            DeepDiveSpecs = allSpecs
                .Where(s => s.ProjectId == p.Id)
                .Select(s => s.Specification)
                .ToList(),
            TechStacks = allTechs
                .Where(t => t.ProjectId == p.Id)
                .Select(t => t.TechnologyName)
                .ToList()
        }).ToList();
    }
}