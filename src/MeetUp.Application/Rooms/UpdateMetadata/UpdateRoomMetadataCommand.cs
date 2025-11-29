using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;

namespace MeetUp.Application.Rooms.UpdateMetadata;

public record UpdateRoomMetadataCommand(Guid MeetingId, RoomMetadata Metadata) : ICommand;