using MeetUp.Application.Mediator;

namespace MeetUp.Application.Rooms.Commands.Delete;

public record DeleteRoomCommand(Guid meetingId) : ICommand;