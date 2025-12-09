using MeetUp.Application.Mediator;

namespace MeetUp.Application.Meetings.Commands.Create;

public record CreateMeetingCommand(
    string Title,
    string? Description,
    DateTime ScheduledAt,
    TimeSpan Duration,
    Guid WorkspaceId,
    string ScreenSharePolicy,
    string RecordingPolicy,
    string ChatPolicy,
    Guid[] Participants) : ICommand<CreateMeetingCommandResponse>;
    
    
public record CreateMeetingCommandResponse(Guid Id);