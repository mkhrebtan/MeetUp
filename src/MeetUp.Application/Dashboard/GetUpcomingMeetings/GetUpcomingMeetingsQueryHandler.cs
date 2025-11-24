using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Application.Meetings.Queries;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Dashboard.GetUpcomingMeetings;

internal sealed class GetUpcomingMeetingsQueryHandler(IApplicationDbContext context, IUserContext userContext)
    : IQueryHandler<GetUpcomingMeetingsQuery, IEnumerable<MeetingDto>>
{
    public async Task<Result<IEnumerable<MeetingDto>>> Handle(GetUpcomingMeetingsQuery request, CancellationToken cancellationToken)
    {
        var upcomingMeetings = await context.Meetings
            .Where(m =>
                (m.OrganizerId == userContext.UserId || m.Participants.Any(p => p.UserId == userContext.UserId)) &&
                m.ScheduledAt > DateTime.UtcNow)
            .OrderBy(m => m.ScheduledAt)
            .Take(request.Count)
            .Select(m => new MeetingDto(
                m.Id,
                m.Title,
                m.Description,
                m.ScheduledAt,
                m.Duration,
                m.Participants.Count,
                m.IsActive))
            .ToListAsync(cancellationToken);

        return Result<IEnumerable<MeetingDto>>.Success(upcomingMeetings);
    }
}