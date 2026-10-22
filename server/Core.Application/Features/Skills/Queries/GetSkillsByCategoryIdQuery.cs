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

public class GetSkillsByCategoryIdQuery : IRequest<IReadOnlyList<SkillItemDto>>
{
    public Guid CategoryId { get; set; }
}

public class GetSkillsByCategoryIdQueryHandler : IRequestHandler<GetSkillsByCategoryIdQuery, IReadOnlyList<SkillItemDto>>
{
    private readonly IGenericRepository<SkillItem> _skillItemRepository;

    public GetSkillsByCategoryIdQueryHandler(IGenericRepository<SkillItem> skillItemRepository)
    {
        _skillItemRepository = skillItemRepository;
    }

    public async Task<IReadOnlyList<SkillItemDto>> Handle(GetSkillsByCategoryIdQuery request, CancellationToken cancellationToken)
    {
        var skills = await _skillItemRepository.FindAsync(s => s.SkillCategoryId == request.CategoryId, cancellationToken);

        return skills.Select(s => new SkillItemDto
        {
            Id = s.Id,
            SkillCategoryId = s.SkillCategoryId,
            Name = s.Name
        }).ToList();
    }
}