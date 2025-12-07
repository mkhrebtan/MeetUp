namespace MeetUp.Application.Recordings.Queries.GetWorkspaceMembersWithoutRecordingAccess;

public record MemberDto(Guid Id, string FullName, string? AvatarUrl);
