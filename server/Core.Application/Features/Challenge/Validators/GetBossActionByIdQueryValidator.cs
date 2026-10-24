using Core.Application.Features.Challenge.Queries;
using FluentValidation;

namespace Core.Application.Features.Challenge.Validators;

public class GetBossActionByIdQueryValidator : AbstractValidator<GetBossActionByIdQuery>
{
    public GetBossActionByIdQueryValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty().WithMessage("Challenge action ID is required.");
    }
}