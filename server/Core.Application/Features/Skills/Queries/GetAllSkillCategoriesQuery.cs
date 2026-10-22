using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Features.Skills.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Skills.Queries;

public class GetAllSkillCategoriesQuery : IRequest<IReadOnlyList<SkillCategoryDto>>
{
}

public class GetAllSkillCategoriesQueryHandler : IRequestHandler<GetAllSkillCategoriesQuery, IReadOnlyList<SkillCategoryDto>>
{
    private readonly IGenericRepository<SkillCategory> _categoryRepository;
    private readonly IGenericRepository<SkillItem> _skillItemRepository;

    public GetAllSkillCategoriesQueryHandler(
        IGenericRepository<SkillCategory> categoryRepository,
        IGenericRepository<SkillItem> skillItemRepository)
    {
        _categoryRepository = categoryRepository;
        _skillItemRepository = skillItemRepository;
    }

    public async Task<IReadOnlyList<SkillCategoryDto>> Handle(GetAllSkillCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetAllAsync(cancellationToken);
        var skills = await _skillItemRepository.GetAllAsync(cancellationToken);

        return categories.Select(c => new SkillCategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            RuneSymbol = c.RuneSymbol,
            Skills = skills
                .Where(s => s.SkillCategoryId == c.Id)
                .Select(s => new SkillItemDto
                {
                    Id = s.Id,
                    SkillCategoryId = s.SkillCategoryId,
                    Name = s.Name
                }).ToList()
        }).ToList();
    }
}