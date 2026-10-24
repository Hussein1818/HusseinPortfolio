using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Features.Profile.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Profile.Queries;

public class GetPortfolioProfileQuery : IRequest<PortfolioProfileDto?>
{
}

public class GetPortfolioProfileQueryHandler : IRequestHandler<GetPortfolioProfileQuery, PortfolioProfileDto?>
{
    private readonly IGenericRepository<PortfolioProfile> _profileRepository;

    public GetPortfolioProfileQueryHandler(IGenericRepository<PortfolioProfile> profileRepository)
    {
        _profileRepository = profileRepository;
    }

    public async Task<PortfolioProfileDto?> Handle(GetPortfolioProfileQuery request, CancellationToken cancellationToken)
    {
        var allProfiles = await _profileRepository.GetAllAsync(cancellationToken);
        var profile = allProfiles.FirstOrDefault();

        if (profile == null)
            return null;

        return new PortfolioProfileDto
        {
            Id = profile.Id,
            Name = profile.Name,
            Title = profile.Title,
            Location = profile.Location,
            Email = profile.Email,
            Phone = profile.Phone,
            GithubUrl = profile.GithubUrl,
            LinkedinUrl = profile.LinkedinUrl,
            DungeonAvatar = profile.DungeonAvatar,
            RecruiterAvatar = profile.RecruiterAvatar,
            Summary = profile.Summary,
            EducationDegree = profile.EducationDegree,
            EducationUniversity = profile.EducationUniversity,
            EducationGrade = profile.EducationGrade,
            CvFileUrl = profile.CvFileUrl
        };
    }
}