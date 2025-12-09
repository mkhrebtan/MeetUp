using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Workspaces.Queries.Get;

internal sealed class GetActiveWorkspaceQueryHandler(IApplicationDbContext context, IUserContext userContext): IQueryHandler<GetWorkspaceQuery, WorkspaceDto>
{
    public async Task<Result<WorkspaceDto>> Handle(GetWorkspaceQuery query, CancellationToken cancellationToken = default)
    {
        var workspace = await context.Workspaces.FindAsync([query.Id,], cancellationToken: cancellationToken);
        return workspace is null ? 
            Result<WorkspaceDto>.Failure(Error.NotFound("Workspace.NotFound", "Workspace not found.")) :
            Result<WorkspaceDto>.Success(new WorkspaceDto(
                workspace.Id,
                workspace.Name,
                workspace.InviteCode,
                workspace.InvitationPolicy.ToString(),
                workspace.MeetingsCreationPolicy.ToString()));
    }
}