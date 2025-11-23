using MeetUp.Domain.Enums;
using MeetUp.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MeetUp.Infrastructure.Persistence.Configurations;

public class WorkspaceUserConfiguration : IEntityTypeConfiguration<WorkspaceUser>
{
    public void Configure(EntityTypeBuilder<WorkspaceUser> builder)
    {
        builder.HasKey(wu => wu.Id);

        builder.HasIndex(wu => new { wu.UserId, wu.WorkspaceId }).IsUnique();

        builder.Property(wu => wu.Role)
            .HasConversion(
                r => r.ToString(),
                r => WorkspaceRole.FromCode(r)!);

        builder.HasOne(wu => wu.User)
            .WithMany()
            .HasForeignKey(wu => wu.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(wu => wu.Workspace)
            .WithMany()
            .HasForeignKey(wu => wu.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
