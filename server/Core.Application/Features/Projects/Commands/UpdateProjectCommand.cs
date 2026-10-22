using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Projects.Commands;

public class UpdateProjectCommand : IRequest<bool>
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

public class UpdateProjectCommandHandler : IRequestHandler<UpdateProjectCommand, bool>
{
    private readonly IGenericRepository<Project> _projectRepository;
    private readonly IGenericRepository<ProjectSpec> _specRepository;
    private readonly IGenericRepository<ProjectTechStack> _techStackRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateProjectCommandHandler(
        IGenericRepository<Project> projectRepository,
        IGenericRepository<ProjectSpec> specRepository,
        IGenericRepository<ProjectTechStack> techStackRepository,
        IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository;
        _specRepository = specRepository;
        _techStackRepository = techStackRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);

        if (project == null)
            throw new KeyNotFoundException($"Project with ID {request.Id} was not found.");

        project.Name = request.Name;
        project.Role = request.Role;
        project.Period = request.Period;
        project.Type = request.Type;
        project.ImageUrl = request.ImageUrl;
        project.SecretArchitecture = request.SecretArchitecture;
        project.SchemaDiagram = request.SchemaDiagram;
        project.Description = request.Description;
        project.LiveUrl = request.LiveUrl;
        project.UpdatedAt = DateTime.UtcNow;

        _projectRepository.Update(project);

        var existingSpecs = await _specRepository.FindAsync(s => s.ProjectId == project.Id, cancellationToken);
        foreach (var spec in existingSpecs)
        {
            _specRepository.Delete(spec);
        }

        var existingTechs = await _techStackRepository.FindAsync(t => t.ProjectId == project.Id, cancellationToken);
        foreach (var tech in existingTechs)
        {
            _techStackRepository.Delete(tech);
        }

        foreach (var specText in request.DeepDiveSpecs.Where(s => !string.IsNullOrWhiteSpace(s)))
        {
            await _specRepository.AddAsync(new ProjectSpec
            {
                ProjectId = project.Id,
                Specification = specText.Trim()
            }, cancellationToken);
        }

        foreach (var techName in request.TechStacks.Where(t => !string.IsNullOrWhiteSpace(t)))
        {
            await _techStackRepository.AddAsync(new ProjectTechStack
            {
                ProjectId = project.Id,
                TechnologyName = techName.Trim()
            }, cancellationToken);
        }

        var result = await _unitOfWork.CompleteAsync(cancellationToken);

        return result > 0;
    }
}