using Livekit.Server.Sdk.Dotnet;
using Microsoft.AspNetCore.Mvc;

namespace MeetUp.API.Controllers;

public class LiveKitApiController(IConfiguration configuration) : ApiControllerBase
{
    [HttpPost("token")]
    public IActionResult GetToken(TokenRequest request)
    {
        var apiKey = configuration["LiveKit:LIVEKIT_API_KEY"];
        var apiSecret = configuration["LiveKit:LIVEKIT_API_SECRET"];

        var token = new AccessToken(apiKey, apiSecret)
            .WithIdentity(request.Identity)
            .WithGrants(new VideoGrants
            {
                RoomJoin = true,
                Room = request.Room,
            })
            .WithTtl(TimeSpan.FromHours(1));
        var jwt = token.ToJwt();
        return Ok(new { token = jwt, });
    }
}

public record TokenRequest(string Identity, string Room);