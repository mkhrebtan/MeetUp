using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Meetings.Queries.GetMeeting;

internal sealed class GetMeetingQueryHandler(IApplicationDbContext context, IUserContext userContext, IRoomService roomService)
    : IQueryHandler<GetMeetingQuery, MeetingDetailsDto>
{
    public async Task<Result<MeetingDetailsDto>> Handle(GetMeetingQuery request, CancellationToken cancellationToken)
    {
        var meeting = await context.Meetings
            .FirstOrDefaultAsync(m => m.Id == request.MeetingId, cancellationToken);
        if (meeting is null)
        {
            return Result<MeetingDetailsDto>.Failure(Error.NotFound("Meeting.NotFound", "Meeting not found."));
        }
        
        var workspaceUser = await context.WorkspaceUsers
            .Include(wu => wu.User)
            .FirstOrDefaultAsync(wu => wu.WorkspaceId == meeting.WorkspaceId && wu.User.Email == userContext.Email, cancellationToken);
        if (workspaceUser is null)
        {
            return Result<MeetingDetailsDto>.Failure(Error.Forbidden("WorkspaceUser.NotFound", "You are not a member of the workspace this meeting belongs to."));
        }

        var meetingDto = new MeetingDetailsDto(
            meeting.Id,
            meeting.Title,
            workspaceUser.Id == meeting.OrganizerId,
            meeting.ChatPolicy.Equals(ChatPolicy.Enabled),
            meeting.ScreenSharePolicy.Equals(ScreenSharePolicy.AllParticipants));

        var meetingsStatus = await roomService.GetMeetingsStatus([meeting.Id]);
        meetingDto.IsActive = meetingsStatus[meeting.Id];

        return Result<MeetingDetailsDto>.Success(meetingDto);
    }
}