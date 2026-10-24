using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Guestbook.Commands;

public class DeleteGuestbookEntryCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string? AuthorToken { get; set; }
    public bool IsAdmin { get; set; }
}

public class DeleteGuestbookEntryCommandHandler : IRequestHandler<DeleteGuestbookEntryCommand, bool>
{
    private readonly IGenericRepository<GuestbookEntry> _guestbookRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteGuestbookEntryCommandHandler(
        IGenericRepository<GuestbookEntry> guestbookRepository,
        IUnitOfWork unitOfWork)
    {
        _guestbookRepository = guestbookRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteGuestbookEntryCommand request, CancellationToken cancellationToken)
    {
        var entry = await _guestbookRepository.GetByIdAsync(request.Id, cancellationToken);

        if (entry == null)
            throw new KeyNotFoundException($"Guestbook entry with ID {request.Id} was not found.");

        if (!request.IsAdmin)
        {
            if (string.IsNullOrWhiteSpace(request.AuthorToken) ||
                !VerifyTokenConstantTime(request.AuthorToken, entry.AuthorTokenHash))
            {
                throw new UnauthorizedAccessException("You are only authorized to delete your own message.");
            }
        }

        _guestbookRepository.SoftDelete(entry);
        var result = await _unitOfWork.CompleteAsync(cancellationToken);

        return result > 0;
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