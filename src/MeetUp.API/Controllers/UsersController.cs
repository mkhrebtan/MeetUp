using MeetUp.API.Extensions;
using MeetUp.Application.Mediator;
using MeetUp.Application.Users.Queries.GetInvitations;
using MeetUp.Application.Workspaces.Commands.RemoveMember;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetUp.API.Controllers;

[Authorize]
public class UsersController : ApiControllerBase
{
    [HttpGet("invitations")]
    [Authorize]
    public async Task<IResult> GetInvitations(
        [FromServices] IQueryHandler<GetUserInvitationsQuery, IEnumerable<InvitationDto>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GetUserInvitationsQuery(), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }
}
