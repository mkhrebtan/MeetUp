using MeetUp.Application.Mediator;

namespace MeetUp.Application.Workspaces.Queries.Get;

public record GetWorkspaceQuery(Guid Id) : IQuery<WorkspaceDto>;