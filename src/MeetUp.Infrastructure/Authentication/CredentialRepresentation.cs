namespace MeetUp.Infrastructure.Authentication;

public record CredentialRepresentation
{
    public string Type { get; init; } = null!;

    public string Value { get; init; } = null!;
    
    public bool Temporary { get; init; }
}