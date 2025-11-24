using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Workspaces.Commands.InviteMember;

internal class InviteWorkspaceMemberCommandHandler(IApplicationDbContext context)
    : ICommandHandler<InviteWorkspaceMemberCommand>
{
    public async Task<Result> Handle(InviteWorkspaceMemberCommand request, CancellationToken cancellationToken)
    {
        var workspace = await context.Workspaces
            .FirstOrDefaultAsync(w => w.Id == request.WorkspaceId, cancellationToken);
        if (workspace is null)
        {
            return Result.Failure(Error.NotFound("Workspace.NotFound", "Workspace with id " + request.WorkspaceId + " not found"));
        }
        
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        if (user is null)
        {
            return Result.Failure(Error.NotFound("User.NotFound", "User with email " + request.Email + " not found"));
        }

        if (context.WorkspaceUsers.Any(wu => wu.UserId == user.Id))
        {
            return Result.Failure(Error.Conflict("Workspace.UserAlreadyMember", "User with email " + request.Email + " is already a member of the workspace"));
        }

        if (context.Invitations.Any(i => i.UserId == user.Id && i.WorkspaceId == workspace.Id))
        {
            return Result.Failure(Error.Conflict("Workspace.InvitationAlreadySent", "An invitation has already been sent to " + request.Email + " for this workspace"));
        }
        
        var invitation = new Invitation
        {
            UserId = user.Id,
            WorkspaceId = workspace.Id,
        };

        context.Invitations.Add(invitation);
        await context.SaveChangesAsync(cancellationToken);
        
        return Result.Success();
    }
}