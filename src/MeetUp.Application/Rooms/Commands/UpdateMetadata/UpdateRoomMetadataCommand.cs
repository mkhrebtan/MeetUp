using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;

namespace MeetUp.Application.Rooms.Commands.UpdateMetadata;

public record UpdateRoomMetadataCommand(Guid MeetingId, RoomMetadata Metadata) : ICommand;