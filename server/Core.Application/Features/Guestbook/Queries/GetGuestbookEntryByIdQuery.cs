using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Features.Guestbook.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Guestbook.Queries;

public class GetGuestbookEntryByIdQuery : IRequest<GuestbookEntryDto>
{
    public Guid Id { get; set; }
}

public class GetGuestbookEntryByIdQueryHandler : IRequestHandler<GetGuestbookEntryByIdQuery, GuestbookEntryDto>
{
    private readonly IGenericRepository<GuestbookEntry> _guestbookRepository;

    public GetGuestbookEntryByIdQueryHandler(IGenericRepository<GuestbookEntry> guestbookRepository)
    {
        _guestbookRepository = guestbookRepository;
    }

    public async Task<GuestbookEntryDto> Handle(GetGuestbookEntryByIdQuery request, CancellationToken cancellationToken)
    {
        var entry = await _guestbookRepository.GetByIdAsync(request.Id, cancellationToken);

        if (entry == null)
            throw new KeyNotFoundException($"Guestbook entry with ID {request.Id} was not found.");

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
}