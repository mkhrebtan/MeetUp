using System.Text.Json.Serialization;
using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Users.Commands.UpdateRole;

public record UpdateUserRoleCommand([property: JsonIgnore] Guid UserId, string Role) : ICommand;

internal sealed class UpdateUserRoleCommandHandler(IApplicationDbContext context, IIdentityProvider identityProvider) : ICommandHandler<UpdateUserRoleCommand>
{
    public async Task<Result> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken = default)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            return Result.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        var role = WorkspaceRole.FromCode(request.Role);
        if (role is null)
        {
            return Result.Failure(Error.NotFound("Role.NotFound", "Role not found."));
        }

        user.Role = role;
        
        await identityProvider.UpdateRole(user, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        
        return Result.Success();
    }
}
