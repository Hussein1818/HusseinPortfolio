using System;
using Core.Application.Features.Projects.Commands;
using FluentValidation;

namespace Core.Application.Features.Projects.Validators;

public class UpdateProjectCommandValidator : AbstractValidator<UpdateProjectCommand>
{
    public UpdateProjectCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty().WithMessage("Project ID is required.");

        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Project name is required.")
            .MaximumLength(150).WithMessage("Project name must not exceed 150 characters.");

        RuleFor(v => v.Role)
            .NotEmpty().WithMessage("Role is required.")
            .MaximumLength(100).WithMessage("Role must not exceed 100 characters.");

        RuleFor(v => v.Description)
            .NotEmpty().WithMessage("Description is required.");

        RuleFor(v => v.LiveUrl)
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .When(v => !string.IsNullOrEmpty(v.LiveUrl))
            .WithMessage("Live URL must be a valid absolute URI.");

        RuleForEach(v => v.TechStacks)
            .NotEmpty().WithMessage("Technology name cannot be empty.")
            .MaximumLength(100).WithMessage("Technology name must not exceed 100 characters.");

        RuleForEach(v => v.DeepDiveSpecs)
            .NotEmpty().WithMessage("Specification cannot be empty.")
            .MaximumLength(500).WithMessage("Specification must not exceed 500 characters.");
    }
}