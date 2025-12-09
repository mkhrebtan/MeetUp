using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Application.Users.Queries.GetUser;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Users.Commands.Update;

internal sealed class UpdateUserCommandHandler(IApplicationDbContext context, IUserContext userContext) : ICommandHandler<UpdateUserCommand, UserDto>
{
    public async Task<Result<UserDto>> Handle(UpdateUserCommand request, CancellationToken cancellationToken = default)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result<UserDto>.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        if (request.Email is not  null && user.Email != request.Email)
        {
            var emailExists = await context.Users.AnyAsync(u => u.Email == request.Email, cancellationToken);
            if (emailExists)
            {
                return Result<UserDto>.Failure(Error.Conflict("User.EmailConflict", "Email already taken."));
            }

            user.Email = request.Email;
        }
        
        user.FirstName = request.FirstName ?? user.FirstName;
        user.LastName = request.LastName ?? user.LastName;
        user.AvatarUrl = request.AvatarUrl ?? string.Empty;

        await context.SaveChangesAsync(cancellationToken);

        var activeWorkspace = await context.WorkspaceUsers
            .Where(wu => wu.UserId == user.Id && wu.IsActive)
            .Select(wu => wu.Workspace)
            .FirstOrDefaultAsync(cancellationToken);
        
        return Result<UserDto>.Success(new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role.ToString(), activeWorkspace?.Id, user.AvatarUrl));
    }
}