using MeetUp.API.Extensions;
using MeetUp.Application.Mediator;
using MeetUp.Application.Workspaces.Commands.Create;
using MeetUp.Application.Workspaces.Commands.Delete;
using MeetUp.Application.Workspaces.Commands.InviteMember;
using MeetUp.Application.Workspaces.Commands.Join;
using MeetUp.Application.Workspaces.Commands.Leave;
using MeetUp.Application.Workspaces.Commands.Update;
using MeetUp.Application.Workspaces.Queries.Get;
using MeetUp.Application.Workspaces.Queries.GetMembers;
using MeetUp.Application.Workspaces.Commands.RemoveMember;
using MeetUp.Domain.Enums;
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
    [Authorize(Roles = "Admin, Member")]
    public async Task<IResult> Get(
        Guid id,
        [FromServices] IQueryHandler<GetWorkspaceQuery, WorkspaceDto> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GetWorkspaceQuery(id), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }

    [HttpPatch("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IResult> Update(
        Guid id,
        UpdateWorkspaceCommand command,
        [FromServices] ICommandHandler<UpdateWorkspaceCommand> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(command with { WorkspaceId = id, }, cancellationToken);
        return result.IsSuccess ? Results.NoContent() : result.GetProblem();
    }
    
    [HttpDelete("{id:guid}/leave")]
    [Authorize(Roles = "Admin, Member")]
    public async Task<IResult> Leave(
        Guid id,
        [FromServices] ICommandHandler<LeaveWorkspaceCommand> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new LeaveWorkspaceCommand(id), cancellationToken);
        return result.IsSuccess ? Results.NoContent() : result.GetProblem();
    }
    
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IResult> Delete(
        Guid id,
        [FromServices] ICommandHandler<DeleteWorkspaceCommand> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new DeleteWorkspaceCommand(id), cancellationToken);
        return result.IsSuccess ? Results.NoContent() : result.GetProblem();
    }
    
    [HttpGet("{id:guid}/members")]
    [Authorize(Roles = "Admin, Member")]
    public async Task<IResult> GetMembers(
        Guid id,
        [FromQuery] string? searchTerm,
        [FromQuery] int page,
        [FromQuery] int pageSize,
        [FromServices] IQueryHandler<GetWorkspaceMembersQuery, Application.Common.Interfaces.IPagedList<WorkspaceMemberDto>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GetWorkspaceMembersQuery(id, searchTerm, page, pageSize), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }

    [HttpPost("{id:guid}/invite")]
    [Authorize(Roles = "Admin, Member")]
    public async Task<IResult> Invite(
        Guid id,
        InviteWorkspaceMembersCommand command,
        [FromServices] ICommandHandler<InviteWorkspaceMembersCommand> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(command with { WorkspaceId = id, }, cancellationToken);
        return result.IsSuccess ? Results.NoContent() : result.GetProblem();
    }
    
    [HttpDelete("{id:guid}/members/{email}")]
    [Authorize(Roles = "Admin")]
    public async Task<IResult> RemoveMember(
        Guid id,
        string email,
        [FromServices] ICommandHandler<RemoveWorkspaceMemberCommand> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new RemoveWorkspaceMemberCommand(id, email), cancellationToken);
        return result.IsSuccess ? Results.NoContent() : result.GetProblem();
    }
}