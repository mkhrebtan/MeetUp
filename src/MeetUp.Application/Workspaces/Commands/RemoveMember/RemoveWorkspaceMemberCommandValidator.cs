using FluentValidation;

namespace MeetUp.Application.Workspaces.Commands.RemoveMember;

public class RemoveWorkspaceMemberCommandValidator : AbstractValidator<RemoveWorkspaceMemberCommand>
{
    public RemoveWorkspaceMemberCommandValidator()
    {
        RuleFor(x => x.WorkspaceId)
            .NotEmpty().WithMessage("Workspace ID cannot be empty.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email cannot be empty.")
            .EmailAddress().WithMessage("Invalid email format.");
    }
}