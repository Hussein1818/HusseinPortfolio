using System;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Features.Auth.DTOs;
using MediatR;

namespace Core.Application.Features.Auth.Queries;

public class GetCurrentUserQuery : IRequest<CurrentUserDto>
{
    public string UserId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, CurrentUserDto>
{
    public Task<CurrentUserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var dto = new CurrentUserDto
        {
            Id = request.UserId,
            Email = request.Email,
            Role = request.Role
        };

        return Task.FromResult(dto);
    }
}