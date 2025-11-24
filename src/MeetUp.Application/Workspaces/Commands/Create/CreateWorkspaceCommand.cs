using MeetUp.Application.Mediator;

namespace MeetUp.Application.Workspaces.Commands.Create;

public record CreateWorkspaceCommand(string Name) : ICommand<CreateWorkspaceCommandResponse>;