namespace MeetUp.Application.Workspaces.Queries.Get;

public record WorkspaceDto(Guid Id, string Name, string InviteCode, string InvitationPolicy, string MeetingsCreationPolicy);