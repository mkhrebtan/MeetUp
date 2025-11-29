using MeetUp.Application.Mediator;
using ICommand = MeetUp.Application.Mediator.ICommand;

namespace MeetUp.Application.Rooms.Commands.AccessToken;

public record GetRoomAccessTokenCommand(Guid MeetingId) : ICommand<GetAccessTokenCommandResponse>;

public record GetAccessTokenCommandResponse(string AccessToken);