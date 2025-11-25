using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Users.Queries.GetInvitations;

internal class GetUserInvitationsQueryHandler(IApplicationDbContext context, IUserContext userContext)
    : IQueryHandler<GetUserInvitationsQuery, IEnumerable<InvitationDto>>
{
    public async Task<Result<IEnumerable<InvitationDto>>> Handle(GetUserInvitationsQuery request, CancellationToken cancellationToken)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result<IEnumerable<InvitationDto>>.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        var invitations = await context.Invitations
            .Where(i => i.UserId == user.Id)
            .Select(i => new InvitationDto(
                i.Workspace.Name,
                i.Workspace.InviteCode,
                i.CreatedAt))
            .ToListAsync(cancellationToken);

        return Result<IEnumerable<InvitationDto>>.Success(invitations);
    }
}