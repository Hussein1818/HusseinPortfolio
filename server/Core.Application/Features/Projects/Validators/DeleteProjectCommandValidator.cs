using Core.Application.Features.Projects.Commands;
using FluentValidation;

namespace Core.Application.Features.Projects.Validators;

public class DeleteProjectCommandValidator : AbstractValidator<DeleteProjectCommand>
{
    public DeleteProjectCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty().WithMessage("Project ID is required.");
    }
}