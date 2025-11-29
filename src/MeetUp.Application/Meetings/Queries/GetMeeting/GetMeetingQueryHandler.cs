using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Meetings.Queries.GetMeeting;

internal sealed class GetMeetingQueryHandler(IApplicationDbContext context, IUserContext userContext, IRoomService roomService)
    : IQueryHandler<GetMeetingQuery, MeetingDto>
{
    public async Task<Result<MeetingDto>> Handle(GetMeetingQuery request, CancellationToken cancellationToken)
    {
        var meeting = await context.Meetings
            .Include(m => m.Participants)
            .FirstOrDefaultAsync(m => m.Id == request.MeetingId, cancellationToken);

        if (meeting is null)
        {
            return Result<MeetingDto>.Failure(Error.NotFound("Meeting.NotFound", "Meeting not found."));
        }

        var meetingDto = new MeetingDto(
            meeting.Id,
            meeting.Title,
            meeting.Description,
            meeting.ScheduledAt,
            meeting.Duration,
            meeting.Participants.Count,
            meeting.InviteCode);

        var meetingsStatus = await roomService.GetMeetingsStatus([meeting.Id]);
        meetingDto.IsActive = meetingsStatus[meeting.Id];

        return Result<MeetingDto>.Success(meetingDto);
    }
}