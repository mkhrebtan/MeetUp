namespace MeetUp.Infrastructure.Authentication;

public record UserRepresentation
{
    public Guid? Id { get; init; }
    
    public string FirstName { get; init; } = null!;
    
    public string LastName { get; init; } = null!;
    
    public string Email { get; init; } = null!;
    
    public bool EmailVerified { get; init; } = false;
    
    public bool Enabled { get; init; } = false;
    
    public List<CredentialRepresentation> Credentials { get; init; } = [];
    
    public List<string> Groups { get; init; } = [];
}