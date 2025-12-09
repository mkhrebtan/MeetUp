using FluentValidation;

namespace MeetUp.Application.Meetings.Commands.AddParticipant;

public class AddMeetingParticipantCommandValidator : AbstractValidator<AddMeetingParticipantCommand>
{
    public AddMeetingParticipantCommandValidator()
    {
        RuleFor(x => x.UserIds).NotEmpty().WithMessage("User IDs are required.");
        RuleFor(x => x.MeetingId).NotEmpty().WithMessage("Meeting ID is required.");
    }
}