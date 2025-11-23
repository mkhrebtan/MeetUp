using MeetUp.Domain.Abstraction;
using MeetUp.Domain.Enums;

namespace MeetUp.Domain.Models;

public class WorkspaceUser : Model
{
    public Guid UserId { get; set; }
    
    public Guid WorkspaceId { get; set; }

    public bool IsActive { get; set; }
    
    public Workspace Workspace { get; set; } = null!;

    public User User { get; set; } = null!;
}