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
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result<IEnumerable<MeetingDto>>.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        var upcomingMeetings = await context.Meetings
            .Where(m =>
                (m.Organizer.UserId == user.Id || m.Participants.Any(p => p.WorkspaceUser.UserId == user.Id)) &&
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
                m.InviteCode))
            .ToListAsync(cancellationToken);

        return Result<IEnumerable<MeetingDto>>.Success(upcomingMeetings);
    }
}