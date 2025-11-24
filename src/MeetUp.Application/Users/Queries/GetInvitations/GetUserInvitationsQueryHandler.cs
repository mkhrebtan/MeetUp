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
        var invitations = await context.Invitations
            .Where(i => i.UserId == userContext.UserId)
            .Select(i => new InvitationDto(
                i.Workspace.Name,
                i.Workspace.InviteCode,
                i.CreatedAt))
            .ToListAsync(cancellationToken);

        return Result<IEnumerable<InvitationDto>>.Success(invitations);
    }
}