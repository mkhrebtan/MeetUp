using MeetUp.Application.Mediator;

namespace MeetUp.Application.Meetings.Queries.GetMeeting;

public record GetMeetingQuery(Guid MeetingId) : IQuery<MeetingDetailsDto>;

public record MeetingDetailsDto(Guid Id, string Title, bool IsHost, bool ChatEnabled, bool ScreenShareEnabled)
{
    public bool IsActive { get; set; } = false;
}