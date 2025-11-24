using FluentValidation;

namespace MeetUp.Application.Workspaces.Commands.Create;

public class CreateWorkspaceCommandValidator : AbstractValidator<CreateWorkspaceCommand>
{
    public CreateWorkspaceCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(250).WithMessage("Name must not exceed 250 characters.");
    }
}