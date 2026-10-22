using Core.Application.Features.Auth.DTOs;
using Core.Application.Interfaces.Services;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Core.Application.Features.Auth.Queries;

public class LoginQuery : IRequest<AuthResponseDto>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginQueryHandler : IRequestHandler<LoginQuery, AuthResponseDto>
{
    private readonly IAuthService _authService;

    public LoginQueryHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<AuthResponseDto> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        var token = await _authService.AuthenticateAsync(request.Email, request.Password, cancellationToken);

        if (string.IsNullOrEmpty(token))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        return new AuthResponseDto { Token = token };
    }
}