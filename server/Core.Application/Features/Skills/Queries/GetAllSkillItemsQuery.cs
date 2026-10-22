using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Features.Skills.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Skills.Queries;

public class GetAllSkillItemsQuery : IRequest<IReadOnlyList<SkillItemDto>>
{
}

public class GetAllSkillItemsQueryHandler : IRequestHandler<GetAllSkillItemsQuery, IReadOnlyList<SkillItemDto>>
{
    private readonly IGenericRepository<SkillItem> _skillItemRepository;

    public GetAllSkillItemsQueryHandler(IGenericRepository<SkillItem> skillItemRepository)
    {
        _skillItemRepository = skillItemRepository;
    }

    public async Task<IReadOnlyList<SkillItemDto>> Handle(GetAllSkillItemsQuery request, CancellationToken cancellationToken)
    {
        var skills = await _skillItemRepository.GetAllAsync(cancellationToken);

        return skills.Select(s => new SkillItemDto
        {
            Id = s.Id,
            SkillCategoryId = s.SkillCategoryId,
            Name = s.Name
        }).ToList();
    }
}