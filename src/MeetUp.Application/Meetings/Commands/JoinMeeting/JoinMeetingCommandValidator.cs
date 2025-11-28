using FluentValidation;

namespace MeetUp.Application.Meetings.Commands.JoinMeeting;

internal sealed class JoinMeetingCommandValidator : AbstractValidator<JoinMeetingCommand>
{
    public JoinMeetingCommandValidator()
    {
        RuleFor(x => x.InviteCode)
            .NotEmpty().WithMessage("Invite code is required.")
            .MaximumLength(11).WithMessage("Invite code must not exceed 11 characters.");
    }
}