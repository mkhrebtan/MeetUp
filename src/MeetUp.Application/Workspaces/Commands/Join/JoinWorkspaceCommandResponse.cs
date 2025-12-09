namespace MeetUp.Application.Workspaces.Commands.Join;

public record JoinWorkspaceCommandResponse(Guid Id, string Name, string InviteCode, string InvitePolicy, string MeetingsCreationPolicy);