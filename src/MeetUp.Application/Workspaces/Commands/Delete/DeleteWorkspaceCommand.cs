using MeetUp.Application.Mediator;

namespace MeetUp.Application.Workspaces.Commands.Delete;

public record DeleteWorkspaceCommand(Guid WorkspaceId) : ICommand;