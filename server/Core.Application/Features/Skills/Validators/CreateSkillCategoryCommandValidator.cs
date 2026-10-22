using Core.Application.Features.Skills.Commands;
using FluentValidation;

namespace Core.Application.Features.Skills.Validators;

public class CreateSkillCategoryCommandValidator : AbstractValidator<CreateSkillCategoryCommand>
{
    public CreateSkillCategoryCommandValidator()
    {
        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Category name is required.")
            .MaximumLength(100).WithMessage("Category name must not exceed 100 characters.");

        RuleFor(v => v.RuneSymbol)
            .MaximumLength(10).WithMessage("Rune symbol must not exceed 10 characters.");
    }
}