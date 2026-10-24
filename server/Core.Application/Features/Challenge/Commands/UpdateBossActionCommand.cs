using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Challenge.Commands;

public class UpdateBossActionCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string ProjectOrigin { get; set; } = string.Empty;
    public string ImpactDescription { get; set; } = string.Empty;
    public int Damage { get; set; }
}

public class UpdateBossActionCommandHandler : IRequestHandler<UpdateBossActionCommand, bool>
{
    private readonly IGenericRepository<BossAction> _bossActionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateBossActionCommandHandler(IGenericRepository<BossAction> bossActionRepository, IUnitOfWork unitOfWork)
    {
        _bossActionRepository = bossActionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdateBossActionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _bossActionRepository.GetByIdAsync(request.Id, cancellationToken);
        if (entity == null)
            throw new KeyNotFoundException($"Challenge action with ID {request.Id} was not found.");

        entity.Label = request.Label.Trim();
        entity.ProjectOrigin = request.ProjectOrigin.Trim();
        entity.ImpactDescription = request.ImpactDescription.Trim();
        entity.Damage = request.Damage;
        entity.UpdatedAt = DateTime.UtcNow;

        _bossActionRepository.Update(entity);
        var result = await _unitOfWork.CompleteAsync(cancellationToken);
        return result > 0;
    }
}