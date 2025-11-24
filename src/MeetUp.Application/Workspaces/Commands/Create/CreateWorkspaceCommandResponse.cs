namespace MeetUp.Application.Workspaces.Commands.Create;

public record CreateWorkspaceCommandResponse(Guid Id, string Name, string InviteCode);