using FluentValidation;

namespace MeetUp.Application.Workspaces.Commands.Join;

public class JoinWorkspaceCommandValidator : AbstractValidator<JoinWorkspaceCommand>
{
    public JoinWorkspaceCommandValidator()
    {
        RuleFor(x => x.InviteCode).NotEmpty().WithMessage("Invite code is required.");
    }
}