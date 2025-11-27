using System.Net;
using System.Net.Http.Json;
using MeetUp.Application.Authentication;
using MeetUp.Domain.Authentication;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.Extensions.Options;

namespace MeetUp.Infrastructure.Authentication;

public class KeycloakIdentityProvider(IHttpClientFactory httpClientFactory, IOptions<KeycloakSettings> keycloakSettings)
    : IIdentityProvider
{
    private readonly Uri _tokenUrl = new($"{keycloakSettings.Value.KeycloakUrl}/realms/{keycloakSettings.Value.Realm}/protocol/openid-connect/token");
    private readonly Uri _createUserUrl = new($"{keycloakSettings.Value.KeycloakUrl}/admin/realms/{keycloakSettings.Value.Realm}/users");

    public async Task<Result> CreateAsync(User user, string password, CancellationToken cancellationToken = default)
    {
        var token = await ObtainAccessToken(cancellationToken);
        
        var userRepresentation = new UserRepresentation
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            EmailVerified = true,
            Enabled = true,
            Credentials = [
                new CredentialRepresentation
                {
                    Type = "password",
                    Value = password,
                    Temporary = false,
                },
            ],
            Groups = user.Role.Equals(WorkspaceRole.NotSet) ? [] : [user.Role.Name,],
            Attributes = new Dictionary<string, string[]>
            {
                { "id", [ user.Id.ToString(), ]},
            },
        };
        
        using var httpClient = httpClientFactory.CreateClient();
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
        var response = await httpClient.PostAsJsonAsync(_createUserUrl, userRepresentation, cancellationToken);
        
        if (response.StatusCode == HttpStatusCode.Conflict)
        {
            return Result.Failure(AuthenticationErrors.DuplicateEmail);
        }
        
        response.EnsureSuccessStatusCode();
        
        return Result.Success();
    }

    public async Task<Result> UpdateRole(User user, CancellationToken cancellationToken = default)
    {
        var token = await ObtainAccessToken(cancellationToken);
        
        var userRepresentation = new UserRepresentation
        {
            Groups = user.Role.Equals(WorkspaceRole.NotSet) ? [] : [user.Role.Name,],
        };
        
        using var httpClient = httpClientFactory.CreateClient();
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
        var response = await httpClient.PutAsJsonAsync($"{_createUserUrl}/{user.Id}", userRepresentation, cancellationToken);
        response.EnsureSuccessStatusCode();
        
        return Result.Success();
    }

    private async Task<string> ObtainAccessToken(CancellationToken cancellationToken = default)
    {
        var parameters = new Dictionary<string, string>
        {
            { "grant_type", "client_credentials" },
            { "client_id", keycloakSettings.Value.ClientId },
            { "client_secret", keycloakSettings.Value.ClientSecret },
        };

        var content = new FormUrlEncodedContent(parameters);

        using var httpClient = httpClientFactory.CreateClient();
        var response = await httpClient.PostAsync(_tokenUrl, content, cancellationToken);

        response.EnsureSuccessStatusCode();
        var tokenResponse = await response.Content.ReadFromJsonAsync<TokenResponse>(cancellationToken: cancellationToken);
        return tokenResponse?.AccessToken ?? throw new InvalidOperationException("Access token not found in response.");
    }
}