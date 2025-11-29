using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Users.Queries.GetUser;

internal sealed class GetUserQueryHandler(IApplicationDbContext context, IUserContext userContext) : IQueryHandler<GetUserQuery, UserDto>
{
    public async Task<Result<UserDto>> Handle(GetUserQuery query, CancellationToken cancellationToken = default)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result<UserDto>.Failure(Error.NotFound("User.NotFound", "User not found."));
        }
        
        var activeWorkspace = await context.WorkspaceUsers
            .Where(wu => wu.UserId == user.Id && wu.IsActive)
            .Select(wu => wu.Workspace)
            .FirstOrDefaultAsync(cancellationToken);
        
        return Result<UserDto>.Success(new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role.Name, activeWorkspace?.Id, user.AvatarUrl));
    }
}