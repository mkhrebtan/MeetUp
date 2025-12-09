using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Rooms.Commands.Delete;

internal sealed class DeleteRoomCommandHandler(IApplicationDbContext context, IRoomService roomService) : ICommandHandler<DeleteRoomCommand>
{
    public async Task<Result> Handle(DeleteRoomCommand request, CancellationToken cancellationToken)
    {
        var meeting = await context.Meetings.FirstOrDefaultAsync(m => m.Id == request.meetingId, cancellationToken);
        if (meeting is null)
        {
            return Result.Failure(Error.NotFound("Meeting.NotFound", "Meeting not found."));
        }

        return  await roomService.DeleteRoom(request.meetingId);
    }
}