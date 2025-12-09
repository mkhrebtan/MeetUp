using MeetUp.Domain.Abstraction;
using MeetUp.Domain.Enums;

namespace MeetUp.Domain.Models;

public class User : Model
{
    public required string FirstName { get; set; }
    
    public required string LastName { get; set; }
    
    public required string Email { get; set; }

    public string AvatarUrl { get; set; } = string.Empty;
    
    public WorkspaceRole Role { get; set; } = WorkspaceRole.Member;

    public DateTime CreatedAt { get; } = DateTime.UtcNow;
}