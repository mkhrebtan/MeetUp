using FluentValidation;

namespace MeetUp.Application.Workspaces.Commands.InviteMember;

public class InviteWorkspaceMemberCommandValidator : AbstractValidator<InviteWorkspaceMembersCommand>
{
    public InviteWorkspaceMemberCommandValidator()
    {
        RuleFor(x => x.WorkspaceId)
            .NotEmpty().WithMessage("Workspace ID is required.");

        RuleFor(x => x.Emails)
            .NotEmpty().WithMessage("At least one email is required.")
            .Must(emails => emails.All(email => !string.IsNullOrWhiteSpace(email) && email.Contains('@')))
            .WithMessage("All emails must be valid email addresses.");
    }
}