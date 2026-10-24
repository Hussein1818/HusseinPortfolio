using Core.Application.Features.Challenge.Commands;
using FluentValidation;

namespace Core.Application.Features.Challenge.Validators;

public class CreateBossActionCommandValidator : AbstractValidator<CreateBossActionCommand>
{
    public CreateBossActionCommandValidator()
    {
        RuleFor(v => v.Label).NotEmpty().MaximumLength(200);
        RuleFor(v => v.ProjectOrigin).NotEmpty().MaximumLength(100);
        RuleFor(v => v.ImpactDescription).NotEmpty().MaximumLength(500);
        RuleFor(v => v.Damage).InclusiveBetween(5, 100);
    }
}