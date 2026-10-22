using Core.Application.Features.Skills.Commands;
using FluentValidation;

namespace Core.Application.Features.Skills.Validators;

public class CreateSkillItemCommandValidator : AbstractValidator<CreateSkillItemCommand>
{
    public CreateSkillItemCommandValidator()
    {
        RuleFor(v => v.SkillCategoryId)
            .NotEmpty().WithMessage("SkillCategoryId is required.");

        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Skill name is required.")
            .MaximumLength(100).WithMessage("Skill name must not exceed 100 characters.");
    }
}