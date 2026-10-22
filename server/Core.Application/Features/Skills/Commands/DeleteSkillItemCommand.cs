using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Skills.Commands;

public class DeleteSkillItemCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

public class DeleteSkillItemCommandHandler : IRequestHandler<DeleteSkillItemCommand, bool>
{
    private readonly IGenericRepository<SkillItem> _skillItemRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteSkillItemCommandHandler(IGenericRepository<SkillItem> skillItemRepository, IUnitOfWork unitOfWork)
    {
        _skillItemRepository = skillItemRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteSkillItemCommand request, CancellationToken cancellationToken)
    {
        var skillItem = await _skillItemRepository.GetByIdAsync(request.Id, cancellationToken);

        if (skillItem == null)
            throw new KeyNotFoundException($"Skill item with ID {request.Id} was not found.");

        _skillItemRepository.SoftDelete(skillItem);
        var result = await _unitOfWork.CompleteAsync(cancellationToken);

        return result > 0;
    }
}