using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;

namespace MeetUp.Application.Recordings.Queries.GetWorkspaceMembersWithoutRecordingAccess;

public record GetWorkspaceMembersWithoutRecordingAccessQuery(Guid WorkspaceId, string StorageKey) : IQuery<ICollection<MemberDto>>;
