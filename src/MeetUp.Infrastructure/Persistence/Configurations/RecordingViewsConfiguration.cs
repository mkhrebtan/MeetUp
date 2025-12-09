using MeetUp.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MeetUp.Infrastructure.Persistence.Configurations;

public class RecordingViewsConfiguration : IEntityTypeConfiguration<RecordViews>
{
    public void Configure(EntityTypeBuilder<RecordViews> builder)
    {
        builder.HasKey(rv => rv.Id);

        builder.Property(rv => rv.RecordingStorageKey)
            .IsRequired();

        builder.Property(rv => rv.Views)
            .IsRequired();

        builder.HasIndex(rv => rv.RecordingStorageKey)
            .IsUnique();
    }
}