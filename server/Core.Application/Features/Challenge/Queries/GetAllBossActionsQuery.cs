using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Features.Challenge.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Challenge.Queries;

public class GetAllBossActionsQuery : IRequest<IReadOnlyList<BossActionDto>>
{
}

public class GetAllBossActionsQueryHandler : IRequestHandler<GetAllBossActionsQuery, IReadOnlyList<BossActionDto>>
{
    private readonly IGenericRepository<BossAction> _bossActionRepository;

    public GetAllBossActionsQueryHandler(IGenericRepository<BossAction> bossActionRepository)
    {
        _bossActionRepository = bossActionRepository;
    }

    public async Task<IReadOnlyList<BossActionDto>> Handle(GetAllBossActionsQuery request, CancellationToken cancellationToken)
    {
        var actions = await _bossActionRepository.GetAllAsync(cancellationToken);

        return actions.Select(a => new BossActionDto
        {
            Id = a.Id,
            Label = a.Label,
            ProjectOrigin = a.ProjectOrigin,
            ImpactDescription = a.ImpactDescription,
            Damage = a.Damage
        }).ToList();
    }
}