using MeetUp.Domain.Abstraction;
using MeetUp.Domain.Enums;

namespace MeetUp.Domain.Models;

public class Meeting : Model
{
    public required string Title { get; set; }

    public string? Description { get; set; }

    public DateTime ScheduledAt { get; set; }

    public TimeSpan Duration { get; set; }

    public Guid WorkspaceId { get; set; }

    public Guid OrganizerId { get; set; }

    public ScreenSharePolicy ScreenSharePolicy { get; set; } = ScreenSharePolicy.HostOnly;

    public RecordingPolicy RecordingPolicy { get; set; } = RecordingPolicy.HostOnly;

    public ChatPolicy ChatPolicy { get; set; } = ChatPolicy.Enabled;

    public bool IsActive { get; set; } = false;
    
    public required string InviteCode { get; set; }
    
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    
    public Workspace Workspace { get; set; } = null!;
    
    public WorkspaceUser Organizer { get; set; } = null!;
    
    public List<MeetingParticipant> Participants { get; set; } = [];
}