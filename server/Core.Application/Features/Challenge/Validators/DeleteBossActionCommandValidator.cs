using Core.Application.Features.Challenge.Commands;
using FluentValidation;

namespace Core.Application.Features.Challenge.Validators;

public class DeleteBossActionCommandValidator : AbstractValidator<DeleteBossActionCommand>
{
    public DeleteBossActionCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty();
    }
}