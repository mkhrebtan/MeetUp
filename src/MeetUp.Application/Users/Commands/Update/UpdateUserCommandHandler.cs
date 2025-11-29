using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Users.Commands.Update;

internal sealed class UpdateUserCommandHandler(IApplicationDbContext context, IUserContext userContext) : ICommandHandler<UpdateUserCommand>
{
    public async Task<Result> Handle(UpdateUserCommand request, CancellationToken cancellationToken = default)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        if (request.Email is not  null && user.Email != request.Email)
        {
            var emailExists = await context.Users.AnyAsync(u => u.Email == request.Email, cancellationToken);
            if (emailExists)
            {
                return Result.Failure(Error.Conflict("User.EmailConflict", "Email already taken."));
            }

            user.Email = request.Email;
        }
        
        user.FirstName = request.FirstName ?? user.FirstName;
        user.LastName = request.LastName ?? user.LastName;
        user.AvatarUrl = request.AvatarUrl ?? string.Empty;

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}