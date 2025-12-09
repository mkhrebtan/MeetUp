using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Application.Meetings.Queries;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace MeetUp.Application.Meetings.Commands.AddParticipant;

internal sealed class AddMeetingParticipantCommandHandler(IApplicationDbContext context) : ICommandHandler<AddMeetingParticipantCommand, MeetingDto>
{
    public async Task<Result<MeetingDto>> Handle(AddMeetingParticipantCommand command, CancellationToken cancellationToken = default)
    {
        var meeting = await context.Meetings
            .Include(m => m.Participants)
                .ThenInclude(p => p.WorkspaceUser)
            .FirstOrDefaultAsync(m => m.Id == command.MeetingId, cancellationToken);
        
        if (meeting is null)
        {
            return Result<MeetingDto>.Failure(Error.NotFound("Meeting.NotFound", "Meeting not found."));
        }

        var workspaceUsers = await context.WorkspaceUsers
            .Where(wu => wu.WorkspaceId == meeting.WorkspaceId && command.UserIds.Contains(wu.UserId))
            .ToDictionaryAsync(wu => wu.UserId, cancellationToken);

        var usersNotInWorkspace = command.UserIds.Where(id => !workspaceUsers.ContainsKey(id)).ToList();
        if (usersNotInWorkspace.Count != 0)
        {
            return Result<MeetingDto>.Failure(Error.NotFound("WorkspaceUser.NotFound", $"Users with Ids {string.Join(", ", usersNotInWorkspace)} are not part of the workspace."));
        }

        var existingParticipantUserIds = meeting.Participants
            .Select(p => p.WorkspaceUser.UserId)
            .ToHashSet();

        var alreadyAddedUsers = command.UserIds.Where(id => existingParticipantUserIds.Contains(id)).ToList();
        if (alreadyAddedUsers.Count != 0)
        {
            return Result<MeetingDto>.Failure(Error.Conflict("Meeting.ParticipantAlreadyAdded", $"Users with Ids {string.Join(", ", alreadyAddedUsers)} are already participants."));
        }

        foreach (var userId in command.UserIds)
        {
            var workspaceUser = workspaceUsers[userId];
            meeting.Participants.Add(new MeetingParticipant
            {
                MeetingId = meeting.Id,
                WorkspaceUserId = workspaceUser.Id,
            });
        }

        await context.SaveChangesAsync(cancellationToken);

        var meetingDto = new MeetingDto(
            meeting.Id,
            meeting.Title,
            meeting.Description,
            meeting.ScheduledAt,
            meeting.Duration,
            meeting.Participants.Count,
            meeting.InviteCode);

        return Result<MeetingDto>.Success(meetingDto);
    }
}
