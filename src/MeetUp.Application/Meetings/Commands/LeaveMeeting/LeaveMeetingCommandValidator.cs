using FluentValidation;

namespace MeetUp.Application.Meetings.Commands.LeaveMeeting;

internal sealed class LeaveMeetingCommandValidator : AbstractValidator<LeaveMeetingCommand>
{
    public LeaveMeetingCommandValidator()
    {
        RuleFor(x => x.MeetingId)
            .NotEmpty().WithMessage("Meeting ID is required.");
    }
}

