using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Workspaces.Queries.GetMembers;

internal class GetWorkspaceMembersQueryHandler(IApplicationDbContext context, IPagedList<WorkspaceMemberDto> pagedList)
    : IQueryHandler<GetWorkspaceMembersQuery, IPagedList<WorkspaceMemberDto>>
{
    public async Task<Result<IPagedList<WorkspaceMemberDto>>> Handle(GetWorkspaceMembersQuery request, CancellationToken cancellationToken)
    {
        var query = context.WorkspaceUsers
            .Where(wm => wm.WorkspaceId == request.WorkspaceId);

        if (request.SearchTerm != null)
        {
            query = query.Where(wm => wm.User.FirstName.Contains(request.SearchTerm) || wm.User.LastName.Contains(request.SearchTerm));
        }

        var projection = query.Select(wm => new WorkspaceMemberDto(
                wm.UserId,
                wm.User.FirstName,
                wm.User.LastName,
                wm.User.Email,
                wm.User.Role.ToString(),
                wm.JoinedAt));

        var list = await pagedList.Create(projection, request.Page, request.PageSize);
        
        return Result<IPagedList<WorkspaceMemberDto>>.Success(list);
    }
}