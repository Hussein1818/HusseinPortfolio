using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Skills.Commands;

public class CreateSkillItemCommand : IRequest<Guid>
{
    public Guid SkillCategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class CreateSkillItemCommandHandler : IRequestHandler<CreateSkillItemCommand, Guid>
{
    private readonly IGenericRepository<SkillCategory> _categoryRepository;
    private readonly IGenericRepository<SkillItem> _skillItemRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateSkillItemCommandHandler(
        IGenericRepository<SkillCategory> categoryRepository,
        IGenericRepository<SkillItem> skillItemRepository,
        IUnitOfWork unitOfWork)
    {
        _categoryRepository = categoryRepository;
        _skillItemRepository = skillItemRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateSkillItemCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.SkillCategoryId, cancellationToken);

        if (category == null)
            throw new KeyNotFoundException($"Skill category with ID {request.SkillCategoryId} was not found.");

        var skillItem = new SkillItem
        {
            SkillCategoryId = request.SkillCategoryId,
            Name = request.Name
        };

        await _skillItemRepository.AddAsync(skillItem, cancellationToken);
        await _unitOfWork.CompleteAsync(cancellationToken);

        return skillItem.Id;
    }
}