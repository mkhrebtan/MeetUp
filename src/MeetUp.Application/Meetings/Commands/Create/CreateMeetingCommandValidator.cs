using FluentValidation;
using MeetUp.Domain.Enums;

namespace MeetUp.Application.Meetings.Commands.Create;

public class CreateMeetingCommandValidator : AbstractValidator<CreateMeetingCommand>
{
    public CreateMeetingCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(250).WithMessage("Title must not exceed 250 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters.");

        RuleFor(x => x.ScheduledAt)
            .NotEmpty().WithMessage("Scheduled date and time is required.")
            .Must(BeAValidDate).WithMessage("Scheduled date and time must be a future date.");

        RuleFor(x => x.Duration)
            .NotEmpty().WithMessage("Duration is required.")
            .GreaterThan(TimeSpan.Zero).WithMessage("Duration must be greater than zero.");

        RuleFor(x => x.WorkspaceId)
            .NotEmpty().WithMessage("Workspace ID is required.");

        RuleFor(x => x.ScreenSharePolicy)
            .NotEmpty().WithMessage("Screen share policy is required.")
            .MaximumLength(50).WithMessage("Screen share policy must not exceed 50 characters.");

        RuleFor(x => x.RecordingPolicy)
            .NotEmpty().WithMessage("Recording policy is required.")
            .MaximumLength(50).WithMessage("Recording policy must not exceed 50 characters.");

        RuleFor(x => x.ChatPolicy)
            .NotEmpty().WithMessage("Chat policy is required.")
            .MaximumLength(50).WithMessage("Chat policy must not exceed 50 characters.");
    }
    
    private static bool BeAValidDate(DateTime date)
    {
        return date >= DateTime.UtcNow;
    }
}