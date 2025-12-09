using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Rooms.Commands.RemoveParticipant;

internal sealed class RemoveParticipantCommandHandler(IRoomService roomService) : ICommandHandler<RemoveParticipantCommand>
{
    public Task<Result> Handle(RemoveParticipantCommand request, CancellationToken cancellationToken = default)
    {
        return roomService.RemoveParticipant(request.Room, request.Participant);
    }
}