using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Rooms.Commands.UpdateMetadata;

internal sealed class UpdateRoomMetadataCommandHandler(
    IApplicationDbContext context,
    IRoomService roomService): ICommandHandler<UpdateRoomMetadataCommand>
{
    public async Task<Result> Handle(UpdateRoomMetadataCommand request, CancellationToken cancellationToken)
    {
        var meeting = await context.Meetings.FirstOrDefaultAsync(m => m.Id == request.MeetingId, cancellationToken);
        if (meeting is null)
        {
            return Result.Failure(Error.NotFound("Meeting.NotFound", "Meeting not found."));
        }
        return await roomService.UpdateRoomMetadata(request.MeetingId, request.Metadata);
    }
}