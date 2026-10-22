using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Features.Skills.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Skills.Queries;

public class GetSkillItemByIdQuery : IRequest<SkillItemDto>
{
    public Guid Id { get; set; }
}

public class GetSkillItemByIdQueryHandler : IRequestHandler<GetSkillItemByIdQuery, SkillItemDto>
{
    private readonly IGenericRepository<SkillItem> _skillItemRepository;

    public GetSkillItemByIdQueryHandler(IGenericRepository<SkillItem> skillItemRepository)
    {
        _skillItemRepository = skillItemRepository;
    }

    public async Task<SkillItemDto> Handle(GetSkillItemByIdQuery request, CancellationToken cancellationToken)
    {
        var skill = await _skillItemRepository.GetByIdAsync(request.Id, cancellationToken);

        if (skill == null)
            throw new KeyNotFoundException($"Skill item with ID {request.Id} was not found.");

        return new SkillItemDto
        {
            Id = skill.Id,
            SkillCategoryId = skill.SkillCategoryId,
            Name = skill.Name
        };
    }
}