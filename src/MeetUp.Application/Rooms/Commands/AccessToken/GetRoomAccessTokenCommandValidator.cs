using FluentValidation;

namespace MeetUp.Application.Rooms.Commands.AccessToken;

internal sealed class GetRoomAccessTokenCommandValidator: FluentValidation.AbstractValidator<GetRoomAccessTokenCommand>
{
    public GetRoomAccessTokenCommandValidator()
    {
        RuleFor(x => x.MeetingId).NotEmpty();
    }
}