using MeetUp.Domain.Abstraction;

namespace MeetUp.Domain.Models;

public class Invitation : Model
{
    public required string UserEmail { get; set; }
    
    public Guid WorkspaceId { get; set; }
    
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    
    public Workspace Workspace { get; set; } = null!;
}