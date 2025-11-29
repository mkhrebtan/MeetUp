using MeetUp.Application.Mediator;

namespace MeetUp.Application.Rooms.Delete;

public record DeleteRoomCommand(Guid meetingId) : ICommand;