using MeetUp.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; set; }
    
    DbSet<Meeting> Meetings { get; set; }
    
    DbSet<Workspace> Workspaces { get; set; }
    
    DbSet<WorkspaceUser> WorkspaceUsers { get; set; }
    
    DbSet<MeetingParticipant> MeetingParticipants { get; set; }
    
    DbSet<Invitation> Invitations { get; set; }
    
    DbSet<SharedRecord> SharedRecords { get; set; }
    
    DbSet<RecordViews> RecordViews { get; set; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}