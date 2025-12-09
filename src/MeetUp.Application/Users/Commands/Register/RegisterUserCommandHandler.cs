using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Users.Commands.Register;

public class RegisterUserCommandHandler(IApplicationDbContext context, IIdentityProvider identityProvider) : ICommandHandler<RegisterUserCommand>
{
    public async Task<Result> Handle(RegisterUserCommand request, CancellationToken cancellationToken = default)
    {
        var userExists = await context.Users.AnyAsync(u => u.Email == request.Email, cancellationToken);
        if (userExists)
        {
            return Result.Failure(Error.Conflict("User.DuplicateEmail", "The specified email is already in use."));
        }

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Role = WorkspaceRole.NotSet,
        };

        await identityProvider.CreateAsync(user, request.Password, cancellationToken);
        
        context.Users.Add(user);

        await context.SaveChangesAsync(cancellationToken);
        
        return Result.Success();
    }
}