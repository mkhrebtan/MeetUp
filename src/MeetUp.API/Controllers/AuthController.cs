using MeetUp.API.Extensions;
using MeetUp.Application.Mediator;
using MeetUp.Application.Users.Commands.Register;
using MeetUp.Application.Users.Queries.GetUser;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetUp.API.Controllers;

public class AuthController : ApiControllerBase
{
    [HttpPost("register")]
    public async Task<IResult> Register(RegisterUserCommand command, [FromServices] ICommandHandler<RegisterUserCommand> handler, CancellationToken cancellationToken)
    {
        var result = await handler.Handle(command, cancellationToken);
        return result.IsSuccess ? Results.Ok(result) : result.GetProblem();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IResult> GetUser(IQueryHandler<GetUserQuery, UserDto> handler, CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GetUserQuery(), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }
}