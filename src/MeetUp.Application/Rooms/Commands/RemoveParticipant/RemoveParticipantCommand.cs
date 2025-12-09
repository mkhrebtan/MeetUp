using MeetUp.Application.Mediator;

namespace MeetUp.Application.Rooms.Commands.RemoveParticipant;

public record RemoveParticipantCommand(string Room, string Participant) : ICommand;