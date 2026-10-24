using System.Text.RegularExpressions;
using Core.Application.Features.Guestbook.Commands;
using FluentValidation;

namespace Core.Application.Features.Guestbook.Validators;

public class UpdateGuestbookEntryCommandValidator : AbstractValidator<UpdateGuestbookEntryCommand>
{
    private static readonly Regex HtmlTagRegex = new("<.*?>", RegexOptions.Compiled);

    public UpdateGuestbookEntryCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty().WithMessage("Guestbook entry ID is required.");

        RuleFor(v => v.ExplorerName)
            .NotEmpty().WithMessage("Explorer name is required.")
            .MaximumLength(100).WithMessage("Explorer name must not exceed 100 characters.")
            .Must(name => !HtmlTagRegex.IsMatch(name ?? string.Empty))
            .WithMessage("HTML tags are not allowed in the explorer name.");

        RuleFor(v => v.GuildOrCompany)
            .MaximumLength(150).WithMessage("Guild or company must not exceed 150 characters.")
            .Must(guild => !HtmlTagRegex.IsMatch(guild ?? string.Empty))
            .WithMessage("HTML tags are not allowed in the guild or company name.");

        RuleFor(v => v.Message)
            .NotEmpty().WithMessage("Message is required.")
            .MaximumLength(1000).WithMessage("Message must not exceed 1000 characters.")
            .Must(msg => !HtmlTagRegex.IsMatch(msg ?? string.Empty))
            .WithMessage("HTML tags are not allowed in the message.");
    }
}