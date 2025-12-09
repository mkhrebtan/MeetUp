using MeetUp.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MeetUp.Infrastructure.Persistence.Configurations;

public class SharedRecordConfiguration : IEntityTypeConfiguration<SharedRecord>
{
    public void Configure(EntityTypeBuilder<SharedRecord> builder)
    {
        builder.HasKey(sr => sr.Id);

        builder.Property(sr => sr.OwnerId)
            .IsRequired();

        builder.Property(sr => sr.RecipientId)
            .IsRequired();

        builder.Property(sr => sr.StorageKey)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(sr => sr.FileName)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(sr => sr.RecordCreatedAt)
            .IsRequired();

        builder.HasIndex(sr => sr.StorageKey)
            .IsUnique();
        
        builder.HasIndex(sr => new { sr.OwnerId, sr.RecipientId, sr.StorageKey })
            .IsUnique();
    }
}