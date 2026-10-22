using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Skills.Commands;

public class UpdateSkillItemCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public Guid SkillCategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class UpdateSkillItemCommandHandler : IRequestHandler<UpdateSkillItemCommand, bool>
{
    private readonly IGenericRepository<SkillCategory> _categoryRepository;
    private readonly IGenericRepository<SkillItem> _skillItemRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateSkillItemCommandHandler(
        IGenericRepository<SkillCategory> categoryRepository,
        IGenericRepository<SkillItem> skillItemRepository,
        IUnitOfWork unitOfWork)
    {
        _categoryRepository = categoryRepository;
        _skillItemRepository = skillItemRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdateSkillItemCommand request, CancellationToken cancellationToken)
    {
        var skillItem = await _skillItemRepository.GetByIdAsync(request.Id, cancellationToken);
        if (skillItem == null)
            throw new KeyNotFoundException($"Skill item with ID {request.Id} was not found.");

        var category = await _categoryRepository.GetByIdAsync(request.SkillCategoryId, cancellationToken);
        if (category == null)
            throw new KeyNotFoundException($"Skill category with ID {request.SkillCategoryId} was not found.");

        skillItem.Name = request.Name;
        skillItem.SkillCategoryId = request.SkillCategoryId;
        skillItem.UpdatedAt = DateTime.UtcNow;

        _skillItemRepository.Update(skillItem);
        var result = await _unitOfWork.CompleteAsync(cancellationToken);

        return result > 0;
    }
}