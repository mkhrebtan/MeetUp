using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;

namespace MeetUp.Application.Workspaces.Queries.GetMembers;

public record GetWorkspaceMembersQuery(Guid WorkspaceId, string? SearchTerm, int Page, int PageSize) : IQuery<IPagedList<WorkspaceMemberDto>>;