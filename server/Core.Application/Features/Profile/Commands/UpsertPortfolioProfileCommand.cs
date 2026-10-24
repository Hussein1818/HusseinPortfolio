using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Features.Profile.DTOs;
using Core.Application.Interfaces.Repositories;
using Core.Domain.Entities;
using MediatR;

namespace Core.Application.Features.Profile.Commands;

public class UpsertPortfolioProfileCommand : IRequest<PortfolioProfileDto>
{
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string GithubUrl { get; set; } = string.Empty;
    public string LinkedinUrl { get; set; } = string.Empty;
    public string DungeonAvatar { get; set; } = string.Empty;
    public string RecruiterAvatar { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string EducationDegree { get; set; } = string.Empty;
    public string EducationUniversity { get; set; } = string.Empty;
    public string EducationGrade { get; set; } = string.Empty;
    public string? CvFileUrl { get; set; }
}

public class UpsertPortfolioProfileCommandHandler : IRequestHandler<UpsertPortfolioProfileCommand, PortfolioProfileDto>
{
    private readonly IGenericRepository<PortfolioProfile> _profileRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpsertPortfolioProfileCommandHandler(
        IGenericRepository<PortfolioProfile> profileRepository,
        IUnitOfWork unitOfWork)
    {
        _profileRepository = profileRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<PortfolioProfileDto> Handle(UpsertPortfolioProfileCommand request, CancellationToken cancellationToken)
    {
        var allProfiles = await _profileRepository.GetAllAsync(cancellationToken);
        var profile = allProfiles.FirstOrDefault();

        if (profile == null)
        {
            profile = new PortfolioProfile
            {
                Name = request.Name.Trim(),
                Title = request.Title.Trim(),
                Location = request.Location.Trim(),
                Email = request.Email.Trim(),
                Phone = request.Phone.Trim(),
                GithubUrl = request.GithubUrl.Trim(),
                LinkedinUrl = request.LinkedinUrl.Trim(),
                DungeonAvatar = request.DungeonAvatar.Trim(),
                RecruiterAvatar = request.RecruiterAvatar.Trim(),
                Summary = request.Summary.Trim(),
                EducationDegree = request.EducationDegree.Trim(),
                EducationUniversity = request.EducationUniversity.Trim(),
                EducationGrade = request.EducationGrade.Trim(),
                CvFileUrl = request.CvFileUrl
            };
            await _profileRepository.AddAsync(profile, cancellationToken);
        }
        else
        {
            profile.Name = request.Name.Trim();
            profile.Title = request.Title.Trim();
            profile.Location = request.Location.Trim();
            profile.Email = request.Email.Trim();
            profile.Phone = request.Phone.Trim();
            profile.GithubUrl = request.GithubUrl.Trim();
            profile.LinkedinUrl = request.LinkedinUrl.Trim();
            profile.DungeonAvatar = request.DungeonAvatar.Trim();
            profile.RecruiterAvatar = request.RecruiterAvatar.Trim();
            profile.Summary = request.Summary.Trim();
            profile.EducationDegree = request.EducationDegree.Trim();
            profile.EducationUniversity = request.EducationUniversity.Trim();
            profile.EducationGrade = request.EducationGrade.Trim();
            if (!string.IsNullOrWhiteSpace(request.CvFileUrl))
            {
                profile.CvFileUrl = request.CvFileUrl;
            }
            profile.UpdatedAt = DateTime.UtcNow;
            _profileRepository.Update(profile);
        }

        await _unitOfWork.CompleteAsync(cancellationToken);

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