using MeetUp.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MeetUp.Infrastructure.Persistence.Configurations;

public class MeetingParticipantConfiguration : IEntityTypeConfiguration<MeetingParticipant>
{
    public void Configure(EntityTypeBuilder<MeetingParticipant> builder)
    {
        builder.HasKey(mp => mp.Id);

        builder.HasIndex(mp => new { mp.MeetingId, mp.WorkspaceUserId, }).IsUnique();

        builder.HasOne(mp => mp.Meeting)
            .WithMany(m => m.Participants)
            .HasForeignKey(mp => mp.MeetingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(mp => mp.WorkspaceUser)
            .WithMany()
            .HasForeignKey(mp => mp.WorkspaceUserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
