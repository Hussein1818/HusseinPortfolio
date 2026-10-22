using Core.Application.Features.Skills.Queries;
using FluentValidation;

namespace Core.Application.Features.Skills.Validators;

public class GetSkillItemByIdQueryValidator : AbstractValidator<GetSkillItemByIdQuery>
{
    public GetSkillItemByIdQueryValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty().WithMessage("Skill item ID is required.");
    }
}