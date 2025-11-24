using MeetUp.Application.Mediator;

namespace MeetUp.Application.Workspaces.Commands.Leave;

public record LeaveWorkspaceCommand(Guid WorkspaceId) : ICommand;