using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Users.Commands.Update;

internal sealed class UpdateUserCommandHandler(IApplicationDbContext context, IUserContext userContext) : ICommandHandler<UpdateUserCommand>
{
    public async Task<Result> Handle(UpdateUserCommand request, CancellationToken cancellationToken = default)
    {
        var user = await context.Users.FindAsync([userContext.UserId,], cancellationToken);
        if (user is null)
        {
            return Result.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Email = request.Email;
        user.AvatarUrl = request.AvatarUrl ?? string.Empty;

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}