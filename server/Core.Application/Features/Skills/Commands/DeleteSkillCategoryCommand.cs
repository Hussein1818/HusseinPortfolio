using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Skills.Commands;

public class DeleteSkillCategoryCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

public class DeleteSkillCategoryCommandHandler : IRequestHandler<DeleteSkillCategoryCommand, bool>
{
    private readonly IGenericRepository<SkillCategory> _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteSkillCategoryCommandHandler(IGenericRepository<SkillCategory> categoryRepository, IUnitOfWork unitOfWork)
    {
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteSkillCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);

        if (category == null)
            throw new KeyNotFoundException($"Skill category with ID {request.Id} was not found.");

        _categoryRepository.SoftDelete(category);
        var result = await _unitOfWork.CompleteAsync(cancellationToken);

        return result > 0;
    }
}