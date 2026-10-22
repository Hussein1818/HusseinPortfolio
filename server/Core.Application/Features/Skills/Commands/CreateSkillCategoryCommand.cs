using System;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Skills.Commands;

public class CreateSkillCategoryCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string RuneSymbol { get; set; } = string.Empty;
}

public class CreateSkillCategoryCommandHandler : IRequestHandler<CreateSkillCategoryCommand, Guid>
{
    private readonly IGenericRepository<SkillCategory> _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateSkillCategoryCommandHandler(IGenericRepository<SkillCategory> categoryRepository, IUnitOfWork unitOfWork)
    {
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateSkillCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = new SkillCategory
        {
            Name = request.Name,
            RuneSymbol = request.RuneSymbol
        };

        await _categoryRepository.AddAsync(category, cancellationToken);
        await _unitOfWork.CompleteAsync(cancellationToken);

        return category.Id;
    }
}