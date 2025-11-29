using MeetUp.API.Extensions;
using MeetUp.Application.Mediator;
using MeetUp.Application.Meetings.Commands.AddParticipant;
using MeetUp.Application.Meetings.Commands.Create;
using MeetUp.Application.Meetings.Commands.Delete;
using MeetUp.Application.Meetings.Commands.JoinMeeting;
using MeetUp.Application.Meetings.Commands.LeaveMeeting;
using MeetUp.Application.Meetings.Queries;
using MeetUp.Application.Meetings.Queries.GetMeeting;
using MeetUp.Application.Meetings.Queries.GetPossibleTimeQuery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetUp.API.Controllers;

public class MeetingController : ApiControllerBase
{
    [HttpPost("")]
    [Authorize(Roles = "Admin, Member")]
    public async Task<IResult> Create(
        CreateMeetingCommand command,
        [FromServices] ICommandHandler<CreateMeetingCommand, CreateMeetingCommandResponse> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(command, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }

    [HttpPost("{meetingId:guid}/participants")]
    [Authorize(Roles = "Admin, Member")]
    public async Task<IResult> AddParticipants(
        Guid meetingId,
        AddMeetingParticipantCommand command,
        [FromServices] ICommandHandler<AddMeetingParticipantCommand, MeetingDto> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(command with { MeetingId = meetingId }, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }
    
    [HttpDelete("{meetingId:guid}")]
    [Authorize(Roles = "Admin, Member")]
    public async Task<IResult> Delete(
        Guid meetingId,
        [FromServices] ICommandHandler<DeleteMeetingCommand> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new DeleteMeetingCommand(meetingId), cancellationToken);
        return result.IsSuccess ? Results.NoContent() : result.GetProblem();
    }
    
    public record JoinMeetingRequest(string InviteCode);
    
    [HttpPost("join")]
    [Authorize(Roles = "Admin, Member")]
    public async Task<IResult> JoinMeeting(
        [FromBody] JoinMeetingRequest request,
        [FromServices] ICommandHandler<JoinMeetingCommand> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new JoinMeetingCommand(request.InviteCode), cancellationToken);
        return result.IsSuccess ? Results.Ok() : result.GetProblem();
    }
    
    [HttpDelete("{meetingId:guid}/leave")]
    [Authorize(Roles = "Admin, Member")]
    public async Task<IResult> LeaveMeeting(
        Guid meetingId,
        [FromServices] ICommandHandler<LeaveMeetingCommand> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new LeaveMeetingCommand(meetingId), cancellationToken);
        return result.IsSuccess ? Results.NoContent() : result.GetProblem();
    }
    
    [HttpGet("{meetingId:guid}")]
    [Authorize(Roles = "Admin, Member")]
    public async Task<IResult> GetMeeting(
        Guid meetingId,
        [FromServices] IQueryHandler<GetMeetingQuery, MeetingDetailsDto> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GetMeetingQuery(meetingId), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }
}