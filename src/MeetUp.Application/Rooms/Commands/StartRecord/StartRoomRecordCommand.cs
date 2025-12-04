using MeetUp.Application.Mediator;

namespace MeetUp.Application.Rooms.Commands.StartRecord;

public record StartRoomRecordCommand(Guid MeetingId) : ICommand<StartRoomRecordCommandResponse>;

public record StartRoomRecordCommandResponse(string RecordingId);