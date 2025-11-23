using MeetUp.Domain.Enums;
using MeetUp.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MeetUp.Infrastructure.Persistence.Configurations;

public class MeetingConfiguration : IEntityTypeConfiguration<Meeting>
{
    public void Configure(EntityTypeBuilder<Meeting> builder)
    {
        builder.HasKey(m => m.Id);

        builder.Property(m => m.Title)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(m => m.Description)
            .HasMaxLength(1000);

        builder.Property(m => m.ScheduledAt)
            .IsRequired();

        builder.Property(m => m.Duration)
            .IsRequired();

        builder.Property(m => m.WorkspaceId)
            .IsRequired();

        builder.Property(m => m.OrganizerId)
            .IsRequired();

        builder.HasOne(m => m.Workspace)
            .WithMany()
            .HasForeignKey(m => m.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(m => m.Organizer)
            .WithMany()
            .HasForeignKey(m => m.OrganizerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(m => m.ChatPolicy)
            .HasConversion(
                p => p.ToString(),
                p => ChatPolicy.FromCode(p)!);
        
        builder.Property(m => m.ScreenSharePolicy)
            .HasConversion(
                p => p.ToString(),
                p => ScreenSharePolicy.FromCode(p)!);

        builder.Property(m => m.RecordingPolicy)
            .HasConversion(
                p => p.ToString(),
                p => RecordingPolicy.FromCode(p)!);
    }
}
