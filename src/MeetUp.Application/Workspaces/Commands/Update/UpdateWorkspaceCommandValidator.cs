using FluentValidation;

namespace MeetUp.Application.Workspaces.Commands.Update;

public class UpdateWorkspaceCommandValidator : AbstractValidator<UpdateWorkspaceCommand>
{
    public UpdateWorkspaceCommandValidator()
    {
        RuleFor(x => x.WorkspaceId)
            .NotEmpty().WithMessage("Workspace ID is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters.");

        RuleFor(x => x.InvitationPolicy)
            .NotEmpty().WithMessage("Invitation policy is required.")
            .MaximumLength(50).WithMessage("Invitation policy must not exceed 50 characters.");

        RuleFor(x => x.MeetingsCreationPolicy)
            .NotEmpty().WithMessage("Meetings creation policy is required.")
            .MaximumLength(50).WithMessage("Meetings creation policy must not exceed 50 characters.");
    }
}