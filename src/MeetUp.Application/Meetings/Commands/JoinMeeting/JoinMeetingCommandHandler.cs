using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Meetings.Commands.JoinMeeting;

internal sealed class JoinMeetingCommandHandler(IApplicationDbContext context, IUserContext userContext)
    : ICommandHandler<JoinMeetingCommand>
{
    public async Task<Result> Handle(JoinMeetingCommand request, CancellationToken cancellationToken = default)
    {
        var meeting = await context.Meetings
            .FirstOrDefaultAsync(m => m.InviteCode == request.InviteCode, cancellationToken);
        if (meeting is null)
        {
            return Result.Failure(Error.NotFound("Meeting.NotFound", "Meeting not found or invite code is invalid."));
        }

        var user = await context.WorkspaceUsers
            .Include(wu => wu.User)
            .FirstOrDefaultAsync(wu => wu.WorkspaceId == meeting.WorkspaceId && wu.User.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result.Failure(Error.NotFound("User.NotFound", "User not found in this workspace."));
        }
        
        var existingParticipant = await context.MeetingParticipants
            .FirstOrDefaultAsync(p => p.MeetingId == meeting.Id && p.WorkspaceUserId == user.Id, cancellationToken);
        
        if (existingParticipant is not null)
        {
            return Result.Failure(Error.Conflict("Meeting.AlreadyJoined", "You are already a participant in this meeting."));
        }

        var participant = new MeetingParticipant
        {
            MeetingId = meeting.Id,
            WorkspaceUserId = user.Id,
        };

        context.MeetingParticipants.Add(participant);

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}