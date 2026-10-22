using FluentValidation;
using Core.Application.Features.Projects.Queries;

namespace Core.Application.Features.Projects.Validators;

public class GetProjectByIdQueryValidator : AbstractValidator<GetProjectByIdQuery>
{
    public GetProjectByIdQueryValidator()
    {
        RuleFor(v => v.Id).NotEmpty().WithMessage("Project ID is required.");
    }
}