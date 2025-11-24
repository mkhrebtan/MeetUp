using FluentValidation;

namespace MeetUp.Application.Workspaces.Commands.Delete;

public class DeleteWorkspaceCommandValidator : AbstractValidator<DeleteWorkspaceCommand>
{
    public DeleteWorkspaceCommandValidator()
    {
        RuleFor(x => x.WorkspaceId)
            .NotEmpty().WithMessage("Workspace ID cannot be empty.");
    }
}