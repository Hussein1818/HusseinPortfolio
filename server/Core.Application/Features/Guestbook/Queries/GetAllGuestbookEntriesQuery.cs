using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Features.Guestbook.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Guestbook.Queries;

public class GetAllGuestbookEntriesQuery : IRequest<IReadOnlyList<GuestbookEntryDto>>
{
}

public class GetAllGuestbookEntriesQueryHandler : IRequestHandler<GetAllGuestbookEntriesQuery, IReadOnlyList<GuestbookEntryDto>>
{
    private readonly IGenericRepository<GuestbookEntry> _guestbookRepository;

    public GetAllGuestbookEntriesQueryHandler(IGenericRepository<GuestbookEntry> guestbookRepository)
    {
        _guestbookRepository = guestbookRepository;
    }

    public async Task<IReadOnlyList<GuestbookEntryDto>> Handle(GetAllGuestbookEntriesQuery request, CancellationToken cancellationToken)
    {
        var entries = await _guestbookRepository.GetAllAsync(cancellationToken);

        return entries
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new GuestbookEntryDto
            {
                Id = e.Id,
                ExplorerName = e.ExplorerName,
                GuildOrCompany = e.GuildOrCompany,
                Message = e.Message,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt,
                AuthorToken = null
            }).ToList();
    }
}