using Core.Application.Features.Skills.Commands;
using FluentValidation;

namespace Core.Application.Features.Skills.Validators;

public class DeleteSkillItemCommandValidator : AbstractValidator<DeleteSkillItemCommand>
{
    public DeleteSkillItemCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty().WithMessage("Skill item ID is required.");
    }
}