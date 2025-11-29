using MeetUp.Application.Mediator;

namespace MeetUp.Application.Meetings.Queries.GetMeeting;

public record GetMeetingQuery(Guid MeetingId) : IQuery<MeetingDto>;