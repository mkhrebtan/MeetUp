using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Rooms.Commands.StartRecord;

internal sealed class StartRoomRecordCommandHandler(
    IRecordingService recordingService,
    IUserContext currentUserService) : ICommandHandler<StartRoomRecordCommand, StartRoomRecordCommandResponse>
{
    public async Task<Result<StartRoomRecordCommandResponse>> Handle(StartRoomRecordCommand request, CancellationToken cancellationToken)
    {
        var egressId = await recordingService.StartRecordingAsync(request.MeetingId, currentUserService.UserId);
        return Result<StartRoomRecordCommandResponse>.Success(new StartRoomRecordCommandResponse(egressId));
    }
}