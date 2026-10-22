using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Features.Skills.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Skills.Queries;

public class GetSkillCategoryByIdQuery : IRequest<SkillCategoryDto>
{
    public Guid Id { get; set; }
}

public class GetSkillCategoryByIdQueryHandler : IRequestHandler<GetSkillCategoryByIdQuery, SkillCategoryDto>
{
    private readonly IGenericRepository<SkillCategory> _categoryRepository;
    private readonly IGenericRepository<SkillItem> _skillItemRepository;

    public GetSkillCategoryByIdQueryHandler(
        IGenericRepository<SkillCategory> categoryRepository,
        IGenericRepository<SkillItem> skillItemRepository)
    {
        _categoryRepository = categoryRepository;
        _skillItemRepository = skillItemRepository;
    }

    public async Task<SkillCategoryDto> Handle(GetSkillCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);

        if (category == null)
            throw new KeyNotFoundException($"Skill category with ID {request.Id} was not found.");

        var skills = await _skillItemRepository.FindAsync(s => s.SkillCategoryId == category.Id, cancellationToken);

        return new SkillCategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            RuneSymbol = category.RuneSymbol,
            Skills = skills.Select(s => new SkillItemDto
            {
                Id = s.Id,
                SkillCategoryId = s.SkillCategoryId,
                Name = s.Name
            }).ToList()
        };
    }
}