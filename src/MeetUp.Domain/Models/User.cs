using MeetUp.Domain.Abstraction;

namespace MeetUp.Domain.Models;

public class User : Model
{
    public required string FirstName { get; set; }
    
    public required string LastName { get; set; }
    
    public required string Email { get; set; }

    public string AvatarUrl { get; set; } = string.Empty;

    public DateTime CreatedAt { get; } = DateTime.UtcNow;
}