using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Rooms.Commands.StopRecord;

internal sealed class StopRoomRecordCommandHandler(IRecordingService roomService) : ICommandHandler<StopRoomRecordCommand>
{
    public async Task<Result> Handle(StopRoomRecordCommand request, CancellationToken cancellationToken)
    {
        await roomService.StopRecordingAsync(request.RecordingId);
        return Result.Success();
    }
}