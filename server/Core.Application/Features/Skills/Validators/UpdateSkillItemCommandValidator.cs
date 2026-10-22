using Core.Application.Features.Skills.Commands;
using FluentValidation;

namespace Core.Application.Features.Skills.Validators;

public class UpdateSkillItemCommandValidator : AbstractValidator<UpdateSkillItemCommand>
{
    public UpdateSkillItemCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty().WithMessage("Skill item ID is required.");

        RuleFor(v => v.SkillCategoryId)
            .NotEmpty().WithMessage("SkillCategoryId is required.");

        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Skill name is required.")
            .MaximumLength(100).WithMessage("Skill name must not exceed 100 characters.");
    }
}