using MeetUp.Domain.Abstraction;

namespace MeetUp.Domain.Models;

public class MeetingParticipant : Model
{
    public Guid MeetingId { get; set; }

    public Guid WorkspaceUserId { get; set; }
    
    public Meeting Meeting { get; set; } = null!;
    
    public WorkspaceUser WorkspaceUser { get; set; } = null!;
}