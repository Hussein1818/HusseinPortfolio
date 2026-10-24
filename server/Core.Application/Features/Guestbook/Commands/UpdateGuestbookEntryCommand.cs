using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Features.Guestbook.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Guestbook.Commands;

public class UpdateGuestbookEntryCommand : IRequest<GuestbookEntryDto>
{
    public Guid Id { get; set; }
    public string ExplorerName { get; set; } = string.Empty;
    public string GuildOrCompany { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? AuthorToken { get; set; }
    public bool IsAdmin { get; set; }
}

public class UpdateGuestbookEntryCommandHandler : IRequestHandler<UpdateGuestbookEntryCommand, GuestbookEntryDto>
{
    private readonly IGenericRepository<GuestbookEntry> _guestbookRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateGuestbookEntryCommandHandler(
        IGenericRepository<GuestbookEntry> guestbookRepository,
        IUnitOfWork unitOfWork)
    {
        _guestbookRepository = guestbookRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<GuestbookEntryDto> Handle(UpdateGuestbookEntryCommand request, CancellationToken cancellationToken)
    {
        var entry = await _guestbookRepository.GetByIdAsync(request.Id, cancellationToken);

        if (entry == null)
            throw new KeyNotFoundException($"Guestbook entry with ID {request.Id} was not found.");

        if (!request.IsAdmin)
        {
            if (string.IsNullOrWhiteSpace(request.AuthorToken) ||
                !VerifyTokenConstantTime(request.AuthorToken, entry.AuthorTokenHash))
            {
                throw new UnauthorizedAccessException("You are only authorized to update your own message.");
            }
        }

        entry.ExplorerName = request.ExplorerName.Trim();
        entry.GuildOrCompany = string.IsNullOrWhiteSpace(request.GuildOrCompany)
            ? "Visitor"
            : request.GuildOrCompany.Trim();
        entry.Message = request.Message.Trim();
        entry.UpdatedAt = DateTime.UtcNow;

        _guestbookRepository.Update(entry);
        await _unitOfWork.CompleteAsync(cancellationToken);

        return new GuestbookEntryDto
        {
            Id = entry.Id,
            ExplorerName = entry.ExplorerName,
            GuildOrCompany = entry.GuildOrCompany,
            Message = entry.Message,
            CreatedAt = entry.CreatedAt,
            UpdatedAt = entry.UpdatedAt,
            AuthorToken = null
        };
    }

    private static bool VerifyTokenConstantTime(string providedToken, string storedHashHex)
    {
        if (string.IsNullOrWhiteSpace(storedHashHex))
            return false;

        var providedHashHex = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(providedToken.Trim())));
        var providedBytes = Encoding.UTF8.GetBytes(providedHashHex);
        var storedBytes = Encoding.UTF8.GetBytes(storedHashHex);

        return providedBytes.Length == storedBytes.Length &&
               CryptographicOperations.FixedTimeEquals(providedBytes, storedBytes);
    }
}