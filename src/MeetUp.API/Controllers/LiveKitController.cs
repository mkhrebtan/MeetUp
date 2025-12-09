using MeetUp.API.Extensions;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Application.Recordings.Commands.ShareRecord;
using MeetUp.Application.Recordings.Commands.Delete;
using MeetUp.Application.Recordings.Queries.GetRecordingUrl;
using MeetUp.Application.Recordings.Queries.GetSharedRecordings;
using MeetUp.Application.Recordings.Queries.GetUserRecordings;
using MeetUp.Application.Recordings.Queries.GetWorkspaceMembersWithoutRecordingAccess;
using MeetUp.Application.Rooms.Commands.AccessToken;
using MeetUp.Application.Rooms.Commands.Delete;
using MeetUp.Application.Rooms.Commands.RemoveParticipant;
using MeetUp.Application.Rooms.Commands.StartRecord;
using MeetUp.Application.Rooms.Commands.StopRecord;
using MeetUp.Application.Rooms.Commands.UpdateMetadata;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetUp.API.Controllers;

public class LiveKitController(IConfiguration configuration) : ApiControllerBase
{
    [HttpPost("token/{meetingId:guid}")]
    [Authorize]
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
    [Authorize]
    public async Task<IResult> DeleteRoom(
        Guid meetingId,
        [FromServices] ICommandHandler<DeleteRoomCommand> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new DeleteRoomCommand(meetingId), cancellationToken);
        return result.IsSuccess ? Results.NoContent() : result.GetProblem();
    }

    [HttpPut("room/{meetingId:guid}/metadata")]
    [Authorize]
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

    [HttpPost("room/{meetingId:guid}/record/start")]
    [Authorize]
    public async Task<IResult> StartRecording(
        Guid meetingId,
        ICommandHandler<StartRoomRecordCommand, StartRoomRecordCommandResponse> commandHandler,
        CancellationToken cancellationToken)
    {
        var command = new StartRoomRecordCommand(meetingId);
        var result = await commandHandler.Handle(command, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }
    
    [HttpPost("room/{meetingId:guid}/record/stop")]
    [Authorize]
    public async Task<IResult> StopRecording(
        Guid meetingId,
        StopRoomRecordCommand command,
        ICommandHandler<StopRoomRecordCommand> commandHandler,
        CancellationToken cancellationToken)
    {        
        var result = await commandHandler.Handle(command, cancellationToken);
        return result.IsSuccess ? Results.NoContent() : result.GetProblem();
    }

    [HttpGet("recordings")]
    [Authorize]
    public async Task<IResult> GetUserRecordings(
        IQueryHandler<GetUserRecordingsQuery, GetUserRecordingsQueryResponse> queryHandler,
        CancellationToken cancellationToken)
    {
        var query = new GetUserRecordingsQuery();
        var result = await queryHandler.Handle(query, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }
    
    [HttpGet("recordings/shared")]
    [Authorize]
    public async Task<IResult> GetSharedRecordings(
        IQueryHandler<GetSharedRecordingsQuery, GetSharedRecordingsQueryResponse> queryHandler,
        CancellationToken cancellationToken)
    {
        var query = new GetSharedRecordingsQuery();
        var result = await queryHandler.Handle(query, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }
    
    [HttpGet("recordings/{recordingKey}")]
    [Authorize]
    public async Task<IResult> GetRecordingUrl(
        string recordingKey,
        IQueryHandler<GetRecordingUrlQuery, GetRecordingUrlQueryResponse> queryHandler,
        CancellationToken cancellationToken)
    {
        var decodedKey = Uri.UnescapeDataString(recordingKey);
        var query = new GetRecordingUrlQuery(decodedKey);
        var result = await queryHandler.Handle(query, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }

    [HttpDelete("recordings/{recordingKey}")]
    [Authorize]
    public async Task<IResult> DeleteRecording(
        string recordingKey,
        [FromServices] ICommandHandler<DeleteRecordCommand> handler,
        CancellationToken cancellationToken)
    {
        var decodedKey = Uri.UnescapeDataString(recordingKey);
        var command = new DeleteRecordCommand(decodedKey);
        var result = await handler.Handle(command, cancellationToken);
        return result.IsSuccess ? Results.NoContent() : result.GetProblem();
    }

    [HttpPost("recordings/share")]
    [Authorize]
    public async Task<IResult> ShareRecording(
        [FromBody] ShareRecordCommand command,
        [FromServices] ICommandHandler<ShareRecordCommand> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(command, cancellationToken);
        return result.IsSuccess ? Results.Ok() : result.GetProblem();
    }

    [HttpGet("workspaces/{workspaceId:guid}/recordings/{storageKey}/members/without-access")]
    [Authorize]
    public async Task<IResult> GetMembersWithoutAccess(
        Guid workspaceId,
        string storageKey,
        [FromServices] IQueryHandler<GetWorkspaceMembersWithoutRecordingAccessQuery, ICollection<MemberDto>> handler,
        CancellationToken cancellationToken)
    {
        var decodedKey = Uri.UnescapeDataString(storageKey);
        var query = new GetWorkspaceMembersWithoutRecordingAccessQuery(workspaceId, decodedKey);
        var result = await handler.Handle(query, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }
    
    [HttpDelete("room/{room}/participant/{participant}")]
    [Authorize]
    public async Task<IResult> RemoveParticipant(
        string room,
        string participant,
        [FromServices] ICommandHandler<RemoveParticipantCommand> handler,
        CancellationToken cancellationToken)
    {
        var command = new RemoveParticipantCommand(room, participant);
        var result = await handler.Handle(command, cancellationToken);
        return result.IsSuccess ? Results.NoContent() : result.GetProblem();
    }
}