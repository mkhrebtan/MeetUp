using MeetUp.Application.Mediator;
using MeetUp.Application.Meetings.Queries;

namespace MeetUp.Application.Dashboard.GetUpcomingMeetings;

public record GetUpcomingMeetingsQuery(int Count) : IQuery<IEnumerable<MeetingDto>>;