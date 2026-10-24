using Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Infrastructure.Data.Configurations;

public class PortfolioProfileConfiguration : IEntityTypeConfiguration<PortfolioProfile>
{
    public void Configure(EntityTypeBuilder<PortfolioProfile> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name).IsRequired().HasMaxLength(150);
        builder.Property(p => p.Title).IsRequired().HasMaxLength(150);
        builder.Property(p => p.Location).IsRequired().HasMaxLength(150);
        builder.Property(p => p.Email).IsRequired().HasMaxLength(150);
        builder.Property(p => p.Phone).IsRequired().HasMaxLength(50);
        builder.Property(p => p.GithubUrl).IsRequired().HasMaxLength(500);
        builder.Property(p => p.LinkedinUrl).IsRequired().HasMaxLength(500);
        builder.Property(p => p.DungeonAvatar).IsRequired();
        builder.Property(p => p.RecruiterAvatar).IsRequired();
        builder.Property(p => p.Summary).IsRequired().HasMaxLength(2000);
        builder.Property(p => p.EducationDegree).IsRequired().HasMaxLength(200);
        builder.Property(p => p.EducationUniversity).IsRequired().HasMaxLength(200);
        builder.Property(p => p.EducationGrade).IsRequired().HasMaxLength(150);

        builder.HasQueryFilter(p => !p.IsDeleted);
    }
}