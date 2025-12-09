using System.Text.Json.Serialization;

namespace MeetUp.Infrastructure.Authentication;

public record TokenResponse
{
    [JsonPropertyName("access_token")] public string AccessToken { get; init; } = null!;

    [JsonPropertyName("expires_in")] public int ExpiresIn { get; init; }

    [JsonPropertyName("token_type")] public string TokenType { get; init; } = null!;

    [JsonPropertyName("scope")] public string Scope { get; init; } = null!;
};