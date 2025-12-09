namespace MeetUp.Infrastructure.Rooms;

public record LiveKitSettings
{
    public string ApiKey { get; init; } = null!;
    
    public string ApiSecret { get; init; } = null!;
    
    public string Url { get; init; } = null!;
    
    public int AccessTokenExpiresInMinutes { get; init; }
}