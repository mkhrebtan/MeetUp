using MeetUp.Domain.Abstraction;
using MeetUp.Domain.Enums;

namespace MeetUp.Domain.Models;

public class Workspace: Model
{
    public required string Name { get; set; }

    public required string InviteCode { get; set; }
    
    public InvitationPolicy InvitationPolicy { get; set; } = InvitationPolicy.OnlyAdmins;
    
    public MeetingsCreationPolicy MeetingsCreationPolicy { get; set; } = MeetingsCreationPolicy.OnlyAdmins;
    
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
}