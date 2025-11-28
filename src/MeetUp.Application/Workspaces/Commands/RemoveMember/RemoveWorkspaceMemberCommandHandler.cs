using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Workspaces.Commands.RemoveMember;

internal sealed class RemoveWorkspaceMemberCommandHandler(IApplicationDbContext context, IUserContext userContext)
    : ICommandHandler<RemoveWorkspaceMemberCommand>
{
    public async Task<Result> Handle(RemoveWorkspaceMemberCommand request, CancellationToken cancellationToken)
    {
        if (userContext.Email == request.Email)
        {
            return Result.Failure(Error.Forbidden("Workspace.SelfRemoval", "You cannot remove yourself from a workspace using this method. Use the leave workspace method instead."));

        }
        
        var workspace = await context.Workspaces
            .FirstOrDefaultAsync(w => w.Id == request.WorkspaceId, cancellationToken);
        if (workspace is null)
        {
            return Result.Failure(Error.NotFound("Workspace.NotFound", "Workspace with id " + request.WorkspaceId + " not found"));
        }

        var currentUserEmail = userContext.Email;
        var currentUser = await context.Users.FirstOrDefaultAsync(u => u.Email == currentUserEmail, cancellationToken);
        if (currentUser is null)
        {
            return Result.Failure(Error.NotFound("User.NotFound", "Current user not found."));
        }
        
        if (!currentUser.Role.Equals(WorkspaceRole.Admin))
        {
            return Result.Failure(Error.Forbidden("Workspace.Unauthorized", "Only admins can remove other members."));
        }

        var workspaceUserToRemove = await context.WorkspaceUsers
            .Include(wu => wu.User)
            .FirstOrDefaultAsync(wu => wu.WorkspaceId == request.WorkspaceId && wu.User.Email == request.Email, cancellationToken);
        if (workspaceUserToRemove is null)
        {
            return Result.Failure(Error.NotFound("Workspace.MemberNotFound", "Member with email " + request.Email + " not found in workspace."));
        }

        context.WorkspaceUsers.Remove(workspaceUserToRemove);
        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}