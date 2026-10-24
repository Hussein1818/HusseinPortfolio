using Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Infrastructure.Data.Configurations;

public class BossActionConfiguration : IEntityTypeConfiguration<BossAction>
{
    public void Configure(EntityTypeBuilder<BossAction> builder)
    {
        builder.HasKey(b => b.Id);

        builder.Property(b => b.Label).IsRequired().HasMaxLength(200);
        builder.Property(b => b.ProjectOrigin).IsRequired().HasMaxLength(100);
        builder.Property(b => b.ImpactDescription).IsRequired().HasMaxLength(500);
        builder.Property(b => b.Damage).IsRequired();

        builder.HasQueryFilter(b => !b.IsDeleted);
    }
}