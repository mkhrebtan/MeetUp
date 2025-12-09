using MeetUp.Application.Mediator;

namespace MeetUp.Application.Workspaces.Commands.RemoveMember;

public record RemoveWorkspaceMemberCommand(Guid WorkspaceId, string Email) : ICommand;