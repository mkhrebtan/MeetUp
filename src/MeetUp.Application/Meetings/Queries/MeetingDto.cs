namespace MeetUp.Application.Meetings.Queries;

public record MeetingDto(
    Guid Id,
    string Title,
    string? Description,
    DateTime ScheduledAt, 
    TimeSpan Duration,
    int Participants,
    bool IsActive,
    string InviteCode);