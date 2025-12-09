using MeetUp.Application.Mediator;

namespace MeetUp.Application.Workspaces.Commands.Join;

public record JoinWorkspaceCommand(string InviteCode) : ICommand<JoinWorkspaceCommandResponse>;