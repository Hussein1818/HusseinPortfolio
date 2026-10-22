using Core.Application.Features.Auth.Queries;
using FluentValidation;

namespace Core.Application.Features.Auth.Validators;

public class GetCurrentUserQueryValidator : AbstractValidator<GetCurrentUserQuery>
{
    public GetCurrentUserQueryValidator()
    {
        RuleFor(v => v.UserId)
            .NotEmpty().WithMessage("User ID claim is required.");
    }
}