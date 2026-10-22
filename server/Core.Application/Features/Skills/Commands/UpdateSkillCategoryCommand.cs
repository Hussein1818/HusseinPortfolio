using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Skills.Commands;

public class UpdateSkillCategoryCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string RuneSymbol { get; set; } = string.Empty;
}

public class UpdateSkillCategoryCommandHandler : IRequestHandler<UpdateSkillCategoryCommand, bool>
{
    private readonly IGenericRepository<SkillCategory> _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateSkillCategoryCommandHandler(IGenericRepository<SkillCategory> categoryRepository, IUnitOfWork unitOfWork)
    {
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdateSkillCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);

        if (category == null)
            throw new KeyNotFoundException($"Skill category with ID {request.Id} was not found.");

        category.Name = request.Name;
        category.RuneSymbol = request.RuneSymbol;
        category.UpdatedAt = DateTime.UtcNow;

        _categoryRepository.Update(category);
        var result = await _unitOfWork.CompleteAsync(cancellationToken);

        return result > 0;
    }
}