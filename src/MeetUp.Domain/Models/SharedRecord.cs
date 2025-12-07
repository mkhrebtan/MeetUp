using MeetUp.Domain.Abstraction;

namespace MeetUp.Domain.Models;

public class SharedRecord : Model
{
    public Guid OwnerId { get; set; }
    
    public Guid RecipientId { get; set; }
    
    public required string StorageKey { get; set; }
    
    public required string FileName { get; set; }
    
    public DateTime RecordCreatedAt { get; set; }
}