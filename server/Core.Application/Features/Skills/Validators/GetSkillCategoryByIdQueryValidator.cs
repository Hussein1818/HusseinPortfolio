using Core.Application.Features.Skills.Queries;
using FluentValidation;

namespace Core.Application.Features.Skills.Validators;

public class GetSkillCategoryByIdQueryValidator : AbstractValidator<GetSkillCategoryByIdQuery>
{
    public GetSkillCategoryByIdQueryValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty().WithMessage("Category ID is required.");
    }
}