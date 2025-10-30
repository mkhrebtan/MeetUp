using Livekit.Server.Sdk.Dotnet;
using Microsoft.AspNetCore.Mvc;

namespace MeetUp.API.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries =
    [
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    ];

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
    }
}

[ApiController]
[Route("[controller]")]
public class LiveKitController(IConfiguration configuration) : ControllerBase
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