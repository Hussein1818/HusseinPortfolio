using Core.Application.Features.Guestbook.Queries;
using FluentValidation;

namespace Core.Application.Features.Guestbook.Validators;

public class GetGuestbookEntryByIdQueryValidator : AbstractValidator<GetGuestbookEntryByIdQuery>
{
    public GetGuestbookEntryByIdQueryValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty().WithMessage("Guestbook entry ID is required.");
    }
}