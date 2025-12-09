using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Workspaces.Commands.Create;

public class CreateWorkspaceCommandHandler(
    IApplicationDbContext context,
    IUserContext userContext,
    IInviteCodeGenerator codeGenerator,
    IIdentityProvider identityProvider)
    : ICommandHandler<CreateWorkspaceCommand, CreateWorkspaceCommandResponse>
{
    public async Task<Result<CreateWorkspaceCommandResponse>> Handle(CreateWorkspaceCommand request, CancellationToken cancellationToken)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result<CreateWorkspaceCommandResponse>.Failure(Error.NotFound("User.NotFound", "User not found."));
        }
        
        var userHasWorkspace = 
            await context.Workspaces.AnyAsync(w => w.Id == user.Id, cancellationToken) ||
            await context.WorkspaceUsers.AnyAsync(wu => wu.UserId == user.Id, cancellationToken);
        if (userHasWorkspace)
        {
            return Result<CreateWorkspaceCommandResponse>.Failure(Error.Conflict("User.AlreadyInWorkspace", "User is already part of a workspace."));
        }

        user.Role = WorkspaceRole.Admin;
        var workspace = new Workspace
        {
            Name = request.Name,
            InviteCode = await GetUniqueInviteCode(),
        };
        var workspaceUser = new WorkspaceUser
        {
            UserId = user.Id,
            IsActive = true,
            Workspace = workspace,
            WorkspaceId = workspace.Id,
        };

        await identityProvider.UpdateRole(user, cancellationToken);
        
        context.Workspaces.Add(workspace);
        context.WorkspaceUsers.Add(workspaceUser);
        
        await context.SaveChangesAsync(cancellationToken);
        
        return Result<CreateWorkspaceCommandResponse>.Success(new CreateWorkspaceCommandResponse(
            workspace.Id,
            workspace.Name,
            workspace.InviteCode,
            workspace.InvitationPolicy.Code,
            workspace.MeetingsCreationPolicy.Code));
    }

    private async Task<string> GetUniqueInviteCode()
    {
        string code;
        bool isUnique;
        do
        {
            code = codeGenerator.Generate();
            var exists = await context.Workspaces.AnyAsync(w => w.Name == code);
            isUnique = !exists;
        } while (!isUnique);
        
        return code;
    }
}