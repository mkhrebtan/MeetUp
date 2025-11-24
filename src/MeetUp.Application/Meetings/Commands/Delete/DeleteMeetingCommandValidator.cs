using FluentValidation;

namespace MeetUp.Application.Meetings.Commands.Delete;

public class DeleteMeetingCommandValidator : AbstractValidator<DeleteMeetingCommand>
{
    public DeleteMeetingCommandValidator()
    {
        RuleFor(x => x.MeetingId).NotEmpty();
    }
}