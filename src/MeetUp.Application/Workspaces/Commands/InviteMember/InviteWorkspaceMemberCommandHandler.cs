using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Workspaces.Commands.InviteMember;

internal class InviteWorkspaceMemberCommandHandler(IApplicationDbContext context, IUserContext userContext)
    : ICommandHandler<InviteWorkspaceMembersCommand>
{
    public async Task<Result> Handle(InviteWorkspaceMembersCommand request, CancellationToken cancellationToken)
    {
        var workspace = await context.Workspaces
            .FirstOrDefaultAsync(w => w.Id == request.WorkspaceId, cancellationToken);
        if (workspace is null)
        {
            return Result.Failure(Error.NotFound("Workspace.NotFound", "Workspace with id " + request.WorkspaceId + " not found"));
        }

        var inviter = await context.Users.FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (inviter is null)
        {
            return Result.Failure(Error.NotFound("User.NotFound", "User with email " + userContext.Email + " not found"));
        }

        if (workspace.InvitationPolicy.Equals(InvitationPolicy.OnlyAdmins) && !inviter.Role.Equals(WorkspaceRole.Admin))
        {
            return Result.Failure(Error.Forbidden("Workspace.InvitationPolicyViolation", "Only admins can invite members to this workspace."));
        }

        var existingWorkspaceUsers = await context.WorkspaceUsers
            .Where(wu => wu.WorkspaceId == request.WorkspaceId && ((IEnumerable<string>)request.Emails).Contains(wu.User.Email)).ToListAsync(cancellationToken);
        if (existingWorkspaceUsers.Count != 0)
        {
            return Result.Failure(Error.Conflict("Workspace.MemberAlreadyExists", "Some users are already members of this workspace."));
        }

        var existingInvitations = await context.Invitations
            .Where(i => i.WorkspaceId == request.WorkspaceId && ((IEnumerable<string>)request.Emails).Contains(i.UserEmail))
            .ToListAsync(cancellationToken);

        var newInvitations = request.Emails
            .Where(email => existingInvitations.All(ei => ei.UserEmail != email) && existingWorkspaceUsers.All(ewu => ewu.User.Email != email))
            .Select(email => new Invitation
            {
                WorkspaceId = request.WorkspaceId,
                UserEmail = email,

            })
            .ToList();

        context.Invitations.AddRange(newInvitations);
        await context.SaveChangesAsync(cancellationToken);
        
        return Result.Success();
    }
}