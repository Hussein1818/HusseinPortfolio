using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Core.Application.Features.Projects.Commands;

public class DeleteProjectCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

public class DeleteProjectCommandHandler : IRequestHandler<DeleteProjectCommand, bool>
{
    private readonly IGenericRepository<Project> _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteProjectCommandHandler(IGenericRepository<Project> projectRepository, IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);

        if (project == null)
            throw new Exception($"Project with ID {request.Id} not found.");

        _projectRepository.SoftDelete(project);
        var result = await _unitOfWork.CompleteAsync(cancellationToken);

        return result > 0;
    }
}