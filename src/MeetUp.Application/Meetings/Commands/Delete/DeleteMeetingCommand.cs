using MeetUp.Application.Mediator;

namespace MeetUp.Application.Meetings.Commands.Delete;

public record DeleteMeetingCommand(Guid MeetingId) : ICommand;