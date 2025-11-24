using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Meetings.Commands.Delete;

internal sealed class DeleteMeetingCommandHandler(IApplicationDbContext context, IUserContext userContext)
    : ICommandHandler<DeleteMeetingCommand>
{
    public async Task<Result> Handle(DeleteMeetingCommand request, CancellationToken cancellationToken = default)
    {
        var meeting = await context.Meetings
            .FirstOrDefaultAsync(m => m.Id == request.MeetingId, cancellationToken);
        if (meeting is null)
        {
            return Result.Failure(Error.NotFound("Meeting.NotFound", "Meeting not found."));
        }

        if (meeting.OrganizerId != userContext.UserId)
        {
            return Result.Failure(Error.Forbidden("Meeting.NotOrganizer", "Only the organizer can delete the meeting."));
        }

        context.Meetings.Remove(meeting);
        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}