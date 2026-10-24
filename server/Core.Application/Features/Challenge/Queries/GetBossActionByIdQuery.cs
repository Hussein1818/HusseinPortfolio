using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Features.Challenge.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Challenge.Queries;

public class GetBossActionByIdQuery : IRequest<BossActionDto>
{
    public Guid Id { get; set; }
}

public class GetBossActionByIdQueryHandler : IRequestHandler<GetBossActionByIdQuery, BossActionDto>
{
    private readonly IGenericRepository<BossAction> _bossActionRepository;

    public GetBossActionByIdQueryHandler(IGenericRepository<BossAction> bossActionRepository)
    {
        _bossActionRepository = bossActionRepository;
    }

    public async Task<BossActionDto> Handle(GetBossActionByIdQuery request, CancellationToken cancellationToken)
    {
        var action = await _bossActionRepository.GetByIdAsync(request.Id, cancellationToken);

        if (action == null)
            throw new KeyNotFoundException($"Challenge action with ID {request.Id} was not found.");

        return new BossActionDto
        {
            Id = action.Id,
            Label = action.Label,
            ProjectOrigin = action.ProjectOrigin,
            ImpactDescription = action.ImpactDescription,
            Damage = action.Damage
        };
    }
}