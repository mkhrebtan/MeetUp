using MeetUp.API.Extensions;
using MeetUp.Application.Mediator;
using MeetUp.Application.Workspaces.Commands.Create;
using MeetUp.Application.Workspaces.Commands.Join;
using MeetUp.Application.Workspaces.Queries.Get;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetUp.API.Controllers;

public class WorkspaceController : ApiControllerBase
{
    [HttpPost("")]
    [Authorize]
    public async Task<IResult> Create(
        CreateWorkspaceCommand command,
        [FromServices] ICommandHandler<CreateWorkspaceCommand, CreateWorkspaceCommandResponse> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(command, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }
    
    [HttpPost("join")]
    [Authorize]
    public async Task<IResult> Join(
        JoinWorkspaceCommand command,
        ICommandHandler<JoinWorkspaceCommand, JoinWorkspaceCommandResponse> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(command, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }
    
    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IResult> GetActive(
        Guid id,
        [FromServices] IQueryHandler<GetWorkspaceQuery, WorkspaceDto> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GetWorkspaceQuery(id), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }
}