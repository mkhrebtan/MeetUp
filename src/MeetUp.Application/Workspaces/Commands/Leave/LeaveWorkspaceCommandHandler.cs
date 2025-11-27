using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Workspaces.Commands.Leave;

internal sealed class LeaveWorkspaceCommandHandler(IApplicationDbContext context, IUserContext userContext, IIdentityProvider identityProvider) : ICommandHandler<LeaveWorkspaceCommand>
{
    public async Task<Result> Handle(LeaveWorkspaceCommand request, CancellationToken cancellationToken = default)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        var workspaceUser = await context.WorkspaceUsers
            .FirstOrDefaultAsync(wu => wu.WorkspaceId == request.WorkspaceId && wu.UserId == user.Id, cancellationToken);

        if (workspaceUser is null)
        {
            return Result.Failure(Error.NotFound("WorkspaceUser.NotFound", "User is not a member of this workspace."));
        }

        user.Role = WorkspaceRole.NotSet;
        await identityProvider.UpdateRole(user, cancellationToken);

        context.WorkspaceUsers.Remove(workspaceUser);
        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}