using Core.Application.Features.Auth.Queries;
using FluentValidation;

namespace Core.Application.Features.Auth.Validators;

public class LoginQueryValidator : AbstractValidator<LoginQuery>
{
    public LoginQueryValidator()
    {
        RuleFor(v => v.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email format is required.");

        RuleFor(v => v.Password)
            .NotEmpty().WithMessage("Password is required.");
    }
}