using MeetUp.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MeetUp.Infrastructure.Persistence.Configurations;

public class InvitationConfiguration : IEntityTypeConfiguration<Invitation>
{
    public void Configure(EntityTypeBuilder<Invitation> builder)
    {
        builder.HasKey(i => i.Id);

        builder.Property(i => i.UserId)
            .IsRequired();

        builder.Property(i => i.WorkspaceId)
            .IsRequired();

        builder.HasOne(i => i.User)
            .WithMany()
            .HasForeignKey(i => i.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.Workspace)
            .WithMany()
            .HasForeignKey(i => i.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
