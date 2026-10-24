using System;
using Core.Application.Features.Profile.Commands;
using FluentValidation;

namespace Core.Application.Features.Profile.Validators;

public class UpsertPortfolioProfileCommandValidator : AbstractValidator<UpsertPortfolioProfileCommand>
{
    public UpsertPortfolioProfileCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(150);
        RuleFor(v => v.Title).NotEmpty().MaximumLength(150);
        RuleFor(v => v.Location).NotEmpty().MaximumLength(150);
        RuleFor(v => v.Email).NotEmpty().EmailAddress().MaximumLength(150);
        RuleFor(v => v.Phone).NotEmpty().MaximumLength(50);

        RuleFor(v => v.GithubUrl)
            .NotEmpty()
            .MaximumLength(500)
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("GitHub URL must be a valid absolute URI.");

        RuleFor(v => v.LinkedinUrl)
            .NotEmpty()
            .MaximumLength(500)
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("LinkedIn URL must be a valid absolute URI.");

        RuleFor(v => v.DungeonAvatar)
            .NotEmpty()
            .MaximumLength(2_000_000)
            .Must(IsSafeImageSource)
            .WithMessage("Explorer avatar must be a valid path, URL, or data:image payload.");

        RuleFor(v => v.RecruiterAvatar)
            .NotEmpty()
            .MaximumLength(2_000_000)
            .Must(IsSafeImageSource)
            .WithMessage("Recruiter avatar must be a valid path, URL, or data:image payload.");

        RuleFor(v => v.Summary).NotEmpty().MaximumLength(2000);
        RuleFor(v => v.EducationDegree).NotEmpty().MaximumLength(200);
        RuleFor(v => v.EducationUniversity).NotEmpty().MaximumLength(200);
        RuleFor(v => v.EducationGrade).NotEmpty().MaximumLength(150);

        RuleFor(v => v.CvFileUrl)
            .MaximumLength(6_000_000)
            .Must(cv => string.IsNullOrEmpty(cv) || cv.StartsWith("/") || cv.StartsWith("https://") || cv.StartsWith("data:application/pdf;base64,"))
            .WithMessage("CV file must be a valid PDF path, HTTPS link, or base64 PDF payload.");
    }

    private static bool IsSafeImageSource(string src)
    {
        return !string.IsNullOrWhiteSpace(src) &&
               (src.StartsWith("/") ||
                src.StartsWith("https://") ||
                src.StartsWith("http://") ||
                src.StartsWith("data:image/"));
    }
}