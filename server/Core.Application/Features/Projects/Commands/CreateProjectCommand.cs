using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Projects.Commands;

public class CreateProjectCommand : IRequest<Guid>
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
    public List<string> DeepDiveSpecs { get; set; } = new();
    public List<string> TechStacks { get; set; } = new();
}

public class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, Guid>
{
    private readonly IGenericRepository<Project> _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateProjectCommandHandler(IGenericRepository<Project> projectRepository, IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = new Project
        {
            Name = request.Name,
            Role = request.Role,
            Period = request.Period,
            Type = request.Type,
            ImageUrl = request.ImageUrl,
            SecretArchitecture = request.SecretArchitecture,
            SchemaDiagram = request.SchemaDiagram,
            Description = request.Description,
            LiveUrl = request.LiveUrl,
            DeepDiveSpecs = request.DeepDiveSpecs
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .Select(s => new ProjectSpec { Specification = s.Trim() })
                .ToList(),
            TechStacks = request.TechStacks
                .Where(t => !string.IsNullOrWhiteSpace(t))
                .Select(t => new ProjectTechStack { TechnologyName = t.Trim() })
                .ToList()
        };

        await _projectRepository.AddAsync(project, cancellationToken);
        await _unitOfWork.CompleteAsync(cancellationToken);

        return project.Id;
    }
}