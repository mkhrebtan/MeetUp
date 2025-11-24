using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Workspaces.Commands.Update;

internal sealed class UpdateWorkspaceCommandHandler(IApplicationDbContext context, IUserContext userContext) : ICommandHandler<UpdateWorkspaceCommand>
{
    public async Task<Result> Handle(UpdateWorkspaceCommand request, CancellationToken cancellationToken = default)
    {
        var user = await context.Users.FindAsync([userContext.UserId,], cancellationToken: cancellationToken);
        if (user is null)
        {
            return Result.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        var workspace = await context.Workspaces.FindAsync([request.WorkspaceId], cancellationToken: cancellationToken);
        if (workspace is null)
        {
            return Result.Failure(Error.NotFound("Workspace.NotFound", "Workspace not found."));
        }

        var workspaceUser = await context.WorkspaceUsers
            .FirstOrDefaultAsync(wu => wu.WorkspaceId == request.WorkspaceId && wu.UserId == user.Id, cancellationToken);
        if (workspaceUser is null || !user.Role.Equals(WorkspaceRole.Admin))
        {
            return Result.Failure(Error.Forbidden("Workspace.Forbidden", "User is not allowed to edit this workspace."));
        }

        var invitationPolicy = InvitationPolicy.FromCode(request.InvitationPolicy);
        if (invitationPolicy is null)
        {
            return Result.Failure(Error.Problem("Workspace.InvalidInvitationPolicy", "Invalid invitation policy."));
        }
        
        var meetingsCreationPolicy = MeetingsCreationPolicy.FromCode(request.MeetingsCreationPolicy);
        if (meetingsCreationPolicy is null)
        {
            return Result.Failure(Error.Problem("Workspace.InvalidMeetingsCreationPolicy", "Invalid meetings creation policy."));
        }

        workspace.Name = request.Name;
        workspace.InvitationPolicy = invitationPolicy;
        workspace.MeetingsCreationPolicy = meetingsCreationPolicy;

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}