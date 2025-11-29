using MeetUp.API.Extensions;
using MeetUp.Application.Mediator;
using MeetUp.Application.Rooms.Commands.AccessToken;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetUp.API.Controllers;

public class LiveKitController(IConfiguration configuration) : ApiControllerBase
{
    [HttpPost("token/{meetingId:guid}")]
    [Authorize(Roles = "Admin, Member")]
    public async Task<IResult> GetToken(
        Guid meetingId,
        ICommandHandler<GetRoomAccessTokenCommand, GetAccessTokenCommandResponse> commandHandler,
        CancellationToken cancellationToken)
    {
        var command = new GetRoomAccessTokenCommand(meetingId);
        var result = await commandHandler.Handle(command, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }
}