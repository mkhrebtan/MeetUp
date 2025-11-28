using MeetUp.Application.Mediator;

namespace MeetUp.Application.Meetings.Commands.LeaveMeeting;

public record LeaveMeetingCommand(Guid MeetingId) : ICommand;


