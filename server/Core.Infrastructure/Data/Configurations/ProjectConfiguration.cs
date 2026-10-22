using Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Infrastructure.Data.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(p => p.Role)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.LiveUrl)
            .HasMaxLength(500);

        builder.HasMany(p => p.DeepDiveSpecs)
            .WithOne(s => s.Project)
            .HasForeignKey(s => s.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.TechStacks)
            .WithOne(t => t.Project)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(p => !p.IsDeleted);
    }
}

public class ProjectSpecConfiguration : IEntityTypeConfiguration<ProjectSpec>
{
    public void Configure(EntityTypeBuilder<ProjectSpec> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Specification)
            .IsRequired()
            .HasMaxLength(500);

        builder.HasQueryFilter(s => !s.IsDeleted);
    }
}

public class ProjectTechStackConfiguration : IEntityTypeConfiguration<ProjectTechStack>
{
    public void Configure(EntityTypeBuilder<ProjectTechStack> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.TechnologyName)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasQueryFilter(t => !t.IsDeleted);
    }
}