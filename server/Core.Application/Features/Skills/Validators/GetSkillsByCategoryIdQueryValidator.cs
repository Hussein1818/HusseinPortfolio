using Core.Application.Features.Skills.Queries;
using FluentValidation;

namespace Core.Application.Features.Skills.Validators;

public class GetSkillsByCategoryIdQueryValidator : AbstractValidator<GetSkillsByCategoryIdQuery>
{
    public GetSkillsByCategoryIdQueryValidator()
    {
        RuleFor(v => v.CategoryId)
            .NotEmpty().WithMessage("Category ID is required.");
    }
}