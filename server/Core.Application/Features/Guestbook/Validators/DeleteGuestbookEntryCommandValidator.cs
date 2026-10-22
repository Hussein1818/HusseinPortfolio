using Core.Application.Features.Guestbook.Commands;
using FluentValidation;

namespace Core.Application.Features.Guestbook.Validators;

public class DeleteGuestbookEntryCommandValidator : AbstractValidator<DeleteGuestbookEntryCommand>
{
    public DeleteGuestbookEntryCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty().WithMessage("Guestbook entry ID is required.");
    }
}