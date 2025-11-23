namespace MeetUp.Infrastructure.Authentication;

public record KeycloakSettings
{
    public KeycloakSettings()
    {
    }
    
    public string KeycloakUrl { get; init; } = null!;
    
    public string Realm { get; init; } = null!;
    
    public string ClientId { get; init; } = null!;
    
    public string ClientSecret { get; init; } = null!;
};