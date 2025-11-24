using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Workspaces.Commands.Delete;

internal sealed class DeleteWorkspaceCommandHandler(IApplicationDbContext context, IUserContext userContext) : ICommandHandler<DeleteWorkspaceCommand>
{
    public async Task<Result> Handle(DeleteWorkspaceCommand request, CancellationToken cancellationToken = default)
    {
        var user = await context.Users.FindAsync([userContext.UserId,], cancellationToken);
        if (user is null)
        {
            return Result.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        var workspace = await context.Workspaces.FindAsync([request.WorkspaceId], cancellationToken);
        if (workspace is null)
        {
            return Result.Failure(Error.NotFound("Workspace.NotFound", "Workspace not found."));
        }

        var workspaceUser = await context.WorkspaceUsers
            .FirstOrDefaultAsync(wu => wu.WorkspaceId == request.WorkspaceId && wu.UserId == user.Id, cancellationToken);

        if (workspaceUser is null || !user.Role.Equals(WorkspaceRole.Admin))
        {
            return Result.Failure(Error.Forbidden("Workspace.Forbidden", "User is not allowed to delete this workspace."));
        }

        context.Workspaces.Remove(workspace);
        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}