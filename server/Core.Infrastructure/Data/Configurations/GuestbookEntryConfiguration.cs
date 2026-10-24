using Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Infrastructure.Data.Configurations;

public class GuestbookEntryConfiguration : IEntityTypeConfiguration<GuestbookEntry>
{
    public void Configure(EntityTypeBuilder<GuestbookEntry> builder)
    {
        builder.HasKey(g => g.Id);

        builder.Property(g => g.ExplorerName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(g => g.GuildOrCompany)
            .HasMaxLength(150);

        builder.Property(g => g.Message)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(g => g.AuthorTokenHash)
            .IsRequired()
            .HasMaxLength(64);

        builder.HasQueryFilter(g => !g.IsDeleted);
    }
}