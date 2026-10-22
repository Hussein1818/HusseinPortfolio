using System.Threading;
using System.Threading.Tasks;
using Core.Application.Features.Guestbook.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Guestbook.Commands;

public class CreateGuestbookEntryCommand : IRequest<GuestbookEntryDto>
{
    public string ExplorerName { get; set; } = string.Empty;
    public string GuildOrCompany { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class CreateGuestbookEntryCommandHandler : IRequestHandler<CreateGuestbookEntryCommand, GuestbookEntryDto>
{
    private readonly IGenericRepository<GuestbookEntry> _guestbookRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateGuestbookEntryCommandHandler(
        IGenericRepository<GuestbookEntry> guestbookRepository,
        IUnitOfWork unitOfWork)
    {
        _guestbookRepository = guestbookRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<GuestbookEntryDto> Handle(CreateGuestbookEntryCommand request, CancellationToken cancellationToken)
    {
        var entry = new GuestbookEntry
        {
            ExplorerName = request.ExplorerName.Trim(),
            GuildOrCompany = request.GuildOrCompany.Trim(),
            Message = request.Message.Trim()
        };

        await _guestbookRepository.AddAsync(entry, cancellationToken);
        await _unitOfWork.CompleteAsync(cancellationToken);

        return new GuestbookEntryDto
        {
            Id = entry.Id,
            ExplorerName = entry.ExplorerName,
            GuildOrCompany = entry.GuildOrCompany,
            Message = entry.Message,
            CreatedAt = entry.CreatedAt
        };
    }
}