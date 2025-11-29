namespace MeetUp.Application.Workspaces.Queries.GetMembers;

public record WorkspaceMemberDto(Guid Id, string FirstName, string LastName, string Email, string? AvatarUrl, string Role, DateTime JoinedAt);