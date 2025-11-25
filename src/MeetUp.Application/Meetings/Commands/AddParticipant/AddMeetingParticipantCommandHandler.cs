using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Application.Meetings.Queries;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Meetings.Commands.AddParticipant;

internal sealed class AddMeetingParticipantCommandHandler(IApplicationDbContext context) : ICommandHandler<AddMeetingParticipantCommand, MeetingDto>
{
    public async Task<Result<MeetingDto>> Handle(AddMeetingParticipantCommand command, CancellationToken cancellationToken = default)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == command.UserId, cancellationToken);
        if (user is null)
        {
            return Result<MeetingDto>.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        var meeting = await context.Meetings
            .Include(m => m.Participants)
            .FirstOrDefaultAsync(m => m.Id == command.MeetingId, cancellationToken);
        if (meeting is null)
        {
            return Result<MeetingDto>.Failure(Error.NotFound("Meeting.NotFound", "Meeting not found."));
        }

        var workspaceUser = await context.WorkspaceUsers
            .FirstOrDefaultAsync(wu => wu.UserId == command.UserId && wu.WorkspaceId == meeting.WorkspaceId, cancellationToken);
        if (workspaceUser is null)
        {
            return Result<MeetingDto>.Failure(Error.NotFound("WorkspaceUser.NotFound", "User is not part of the workspace."));
        }

        if (meeting.Participants.Any(p => p.WorkspaceUser.UserId == command.UserId))
        {
            return Result<MeetingDto>.Failure(Error.Conflict("Meeting.ParticipantAlreadyAdded", "User is already a participant in this meeting."));
        }

        meeting.Participants.Add(new MeetingParticipant
        {
            MeetingId = meeting.Id,
            WorkspaceUserId = workspaceUser.Id,
        });
        await context.SaveChangesAsync(cancellationToken);

        var meetingDto = new MeetingDto(
            meeting.Id,
            meeting.Title,
            meeting.Description,
            meeting.ScheduledAt,
            meeting.Duration,
            meeting.Participants.Count,
            meeting.IsActive);

        return Result<MeetingDto>.Success(meetingDto);

    }
}