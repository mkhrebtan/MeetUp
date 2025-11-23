using MeetUp.Domain.Abstraction;
using MeetUp.Domain.Enums;

namespace MeetUp.Domain.Models;

public class Workspace: Model
{
    public required string Name { get; set; }

    public InvitationPolicy InvitationPolicy { get; set; } = InvitationPolicy.OnlyAdmins;
    
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
}