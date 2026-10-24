using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Challenge.Commands;

public class DeleteBossActionCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

public class DeleteBossActionCommandHandler : IRequestHandler<DeleteBossActionCommand, bool>
{
    private readonly IGenericRepository<BossAction> _bossActionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteBossActionCommandHandler(IGenericRepository<BossAction> bossActionRepository, IUnitOfWork unitOfWork)
    {
        _bossActionRepository = bossActionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteBossActionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _bossActionRepository.GetByIdAsync(request.Id, cancellationToken);
        if (entity == null)
            throw new KeyNotFoundException($"Challenge action with ID {request.Id} was not found.");

        _bossActionRepository.SoftDelete(entity);
        var result = await _unitOfWork.CompleteAsync(cancellationToken);
        return result > 0;
    }
}