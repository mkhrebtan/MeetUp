using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Meetings.Commands.LeaveMeeting;

internal sealed class LeaveMeetingCommandHandler(IApplicationDbContext context, IUserContext userContext)
    : ICommandHandler<LeaveMeetingCommand>
{
    public async Task<Result> Handle(LeaveMeetingCommand request, CancellationToken cancellationToken = default)
    {
        var meeting = await context.Meetings
            .FirstOrDefaultAsync(m => m.Id == request.MeetingId, cancellationToken);
        if (meeting is null)
        {
            return Result.Failure(Error.NotFound("Meeting.NotFound", "Meeting not found."));
        }

        var user = await context.WorkspaceUsers
            .Include(wu => wu.User)
            .FirstOrDefaultAsync(wu => wu.WorkspaceId == meeting.WorkspaceId && wu.User.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result.Failure(Error.NotFound("User.NotFound", "User not found in this workspace."));
        }

        var participant = await context.MeetingParticipants
            .FirstOrDefaultAsync(p => p.MeetingId == meeting.Id && p.WorkspaceUserId == user.Id, cancellationToken);
        
        if (participant is null)
        {
            return Result.Failure(Error.NotFound("Meeting.NotParticipant", "You are not a participant in this meeting."));
        }
        
        if (meeting.OrganizerId == user.Id)
        {
            return Result.Failure(Error.Forbidden("Meeting.OrganizerCannotLeave", "Meeting organizer cannot leave the meeting. Delete the meeting instead."));
        }

        context.MeetingParticipants.Remove(participant);

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}

