using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Guestbook.Commands;

public class DeleteGuestbookEntryCommand : IRequest<bool>
{
    public Guid Id { get; set; }
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

        _guestbookRepository.SoftDelete(entry);
        var result = await _unitOfWork.CompleteAsync(cancellationToken);

        return result > 0;
    }
}