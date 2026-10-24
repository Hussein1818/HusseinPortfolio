using System;
using Core.Application.Features.Projects.Commands;
using FluentValidation;

namespace Core.Application.Features.Projects.Validators;

public class CreateProjectCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Project name is required.")
            .MaximumLength(150).WithMessage("Project name must not exceed 150 characters.");

        RuleFor(v => v.Role)
            .NotEmpty().WithMessage("Role is required.")
            .MaximumLength(100).WithMessage("Role must not exceed 100 characters.");

        RuleFor(v => v.Period)
            .MaximumLength(100).WithMessage("Period must not exceed 100 characters.");

        RuleFor(v => v.Type)
            .MaximumLength(150).WithMessage("Project type must not exceed 150 characters.");

        RuleFor(v => v.ImageUrl)
            .NotEmpty().WithMessage("Project image is required.")
            .MaximumLength(2_000_000).WithMessage("Image data exceeds the maximum allowed size.")
            .Must(img =>
                img.StartsWith("/") ||
                img.StartsWith("https://") ||
                img.StartsWith("http://") ||
                img.StartsWith("data:image/"))
            .WithMessage("Image must be a valid relative path, HTTP/HTTPS URL, or data:image payload.");

        RuleFor(v => v.SecretArchitecture)
            .MaximumLength(500).WithMessage("Secret architecture must not exceed 500 characters.");

        RuleFor(v => v.SchemaDiagram)
            .MaximumLength(1000).WithMessage("Schema diagram must not exceed 1000 characters.");

        RuleFor(v => v.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters.");

        RuleFor(v => v.LiveUrl)
            .MaximumLength(500).WithMessage("Live URL must not exceed 500 characters.")
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