using MeetUp.Application.Mediator;

namespace MeetUp.Application.Meetings.Queries.GetPossibleTimeQuery;

public record GetPossibleMeetingTimeQuery(IList<Guid> MembersIds, DateTime ScheduledAt, DateTime EarliestStart, DateTime LatestEnd, int DurationInMinutes) : IQuery<IEnumerable<Interval>>;