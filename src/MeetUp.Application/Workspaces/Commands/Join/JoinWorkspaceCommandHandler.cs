using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Workspaces.Commands.Join;

public class JoinWorkspaceCommandHandler(IApplicationDbContext context, IUserContext userContext, IIdentityProvider identityProvider)
    : ICommandHandler<JoinWorkspaceCommand, JoinWorkspaceCommandResponse>
{
    public async Task<Result<JoinWorkspaceCommandResponse>> Handle(JoinWorkspaceCommand request, CancellationToken cancellationToken)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result<JoinWorkspaceCommandResponse>.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        var workspace = await context.Workspaces.FirstOrDefaultAsync(w => w.InviteCode == request.InviteCode, cancellationToken);
        if (workspace is null)
        {
            return Result<JoinWorkspaceCommandResponse>.Failure(Error.NotFound("Workspace.NotFound", "Workspace not found."));
        }

        var workspaceUser = new WorkspaceUser
        {
            UserId = user.Id,
            WorkspaceId = workspace.Id,
            IsActive = true,
        };
        user.Role = WorkspaceRole.Member;

        await identityProvider.UpdateRole(user, cancellationToken);
        
        context.WorkspaceUsers.Add(workspaceUser);
        await context.SaveChangesAsync(cancellationToken);

        return Result<JoinWorkspaceCommandResponse>.Success(new JoinWorkspaceCommandResponse(workspace.Id, workspace.Name, workspace.InviteCode));
    }
}