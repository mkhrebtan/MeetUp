using MeetUp.Application.Mediator;

namespace MeetUp.Application.Workspaces.Commands.Update;

public record UpdateWorkspaceCommand(Guid WorkspaceId, string Name, string InvitationPolicy, string MeetingsCreationPolicy) : ICommand;