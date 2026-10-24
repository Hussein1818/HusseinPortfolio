using System;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Challenge.Commands;

public class CreateBossActionCommand : IRequest<Guid>
{
    public string Label { get; set; } = string.Empty;
    public string ProjectOrigin { get; set; } = string.Empty;
    public string ImpactDescription { get; set; } = string.Empty;
    public int Damage { get; set; }
}

public class CreateBossActionCommandHandler : IRequestHandler<CreateBossActionCommand, Guid>
{
    private readonly IGenericRepository<BossAction> _bossActionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateBossActionCommandHandler(IGenericRepository<BossAction> bossActionRepository, IUnitOfWork unitOfWork)
    {
        _bossActionRepository = bossActionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateBossActionCommand request, CancellationToken cancellationToken)
    {
        var entity = new BossAction
        {
            Label = request.Label.Trim(),
            ProjectOrigin = request.ProjectOrigin.Trim(),
            ImpactDescription = request.ImpactDescription.Trim(),
            Damage = request.Damage
        };

        await _bossActionRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.CompleteAsync(cancellationToken);

        return entity.Id;
    }
}