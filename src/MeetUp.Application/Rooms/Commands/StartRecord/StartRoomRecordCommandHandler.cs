using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Rooms.Commands.StartRecord;

internal sealed class StartRoomRecordCommandHandler(
    IApplicationDbContext context,
    IRecordingService recordingService,
    IUserContext currentUserService) : ICommandHandler<StartRoomRecordCommand, StartRoomRecordCommandResponse>
{
    public async Task<Result<StartRoomRecordCommandResponse>> Handle(StartRoomRecordCommand request, CancellationToken cancellationToken)
    {
        var meeting = await context.Meetings.FindAsync([request.MeetingId,], cancellationToken: cancellationToken);
        if (meeting is null)
        {
            return Result<StartRoomRecordCommandResponse>.Failure(Error.NotFound("Meeting.NotFound", "Meeting not found."));
        }
        
        var egressId = await recordingService.StartRecordingAsync(request.MeetingId, currentUserService.UserId, meeting.Title);
        return Result<StartRoomRecordCommandResponse>.Success(new StartRoomRecordCommandResponse(egressId));
    }
}