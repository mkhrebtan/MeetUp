using MeetUp.Application.Mediator;

namespace MeetUp.Application.Rooms.Commands.StopRecord;

public record StopRoomRecordCommand(string RecordingId) : ICommand;