using MeetUp.Domain.Enums;
using MeetUp.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MeetUp.Infrastructure.Persistence.Configurations;

public class WorkspaceConfiguration : IEntityTypeConfiguration<Workspace>
{
    public void Configure(EntityTypeBuilder<Workspace> builder)
    {
        builder.HasKey(w => w.Id);

        builder.Property(w => w.Name)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(w => w.InvitationPolicy)
            .HasConversion(
                p => p.ToString(),
                p => InvitationPolicy.FromCode(p)!);
        
        builder.Property(w => w.MeetingsCreationPolicy)
            .HasConversion(
                p => p.ToString(),
                p => MeetingsCreationPolicy.FromCode(p)!);

        builder.Property(w => w.InviteCode)
            .HasMaxLength(12);
        
        builder.HasIndex(w => w.InviteCode)
            .IsUnique();
    }
}
