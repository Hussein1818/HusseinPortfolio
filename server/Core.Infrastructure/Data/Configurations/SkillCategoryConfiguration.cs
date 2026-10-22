using Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Infrastructure.Data.Configurations;

public class SkillCategoryConfiguration : IEntityTypeConfiguration<SkillCategory>
{
    public void Configure(EntityTypeBuilder<SkillCategory> builder)
    {
        builder.HasKey(sc => sc.Id);

        builder.Property(sc => sc.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(sc => sc.RuneSymbol)
            .HasMaxLength(10);

        builder.HasMany(sc => sc.Skills)
            .WithOne(s => s.SkillCategory)
            .HasForeignKey(s => s.SkillCategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(sc => !sc.IsDeleted);
    }
}

public class SkillItemConfiguration : IEntityTypeConfiguration<SkillItem>

{
    public void Configure(EntityTypeBuilder<SkillItem> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasQueryFilter(s => !s.IsDeleted);
    }
}