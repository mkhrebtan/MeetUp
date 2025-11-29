using MeetUp.API.Extensions;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Application.Rooms.Commands.AccessToken;
using MeetUp.Application.Rooms.Delete;
using MeetUp.Application.Rooms.UpdateMetadata;
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
    
    [HttpDelete("room/{meetingId:guid}")]
    [Authorize(Roles = "Admin, Member")]
    public async Task<IResult> DeleteRoom(
        Guid meetingId,
        [FromServices] ICommandHandler<DeleteRoomCommand> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new DeleteRoomCommand(meetingId), cancellationToken);
        return result.IsSuccess ? Results.NoContent() : result.GetProblem();
    }

    [HttpPut("room/{meetingId:guid}/metadata")]
    [Authorize(Roles = "Admin, Member")]
    public async Task<IResult> UpdateRoomMetadata(
        Guid meetingId,
        [FromBody] RoomMetadata metadata,
        [FromServices] ICommandHandler<UpdateRoomMetadataCommand> handler,
        CancellationToken cancellationToken)
    {
        var command = new UpdateRoomMetadataCommand(meetingId, metadata);
        var result = await handler.Handle(command, cancellationToken);
        return result.IsSuccess ? Results.NoContent() : result.GetProblem();
    }
}