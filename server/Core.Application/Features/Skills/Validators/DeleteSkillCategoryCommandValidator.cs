using Core.Application.Features.Skills.Commands;
using FluentValidation;

namespace Core.Application.Features.Skills.Validators;

public class DeleteSkillCategoryCommandValidator : AbstractValidator<DeleteSkillCategoryCommand>
{
    public DeleteSkillCategoryCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty().WithMessage("Category ID is required.");
    }
}