using MeetUp.Application.Mediator;

namespace MeetUp.Application.Meetings.Commands.JoinMeeting;

public record JoinMeetingCommand(string InviteCode) : ICommand;