using FluentValidation;

namespace MeetUp.Application.Workspaces.Commands.InviteMember;

public class InviteWorkspaceMemberCommandValidator : AbstractValidator<InviteWorkspaceMemberCommand>
{
    public InviteWorkspaceMemberCommandValidator()
    {
        RuleFor(x => x.WorkspaceId)
            .NotEmpty().WithMessage("Workspace ID is required.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");
    }
}