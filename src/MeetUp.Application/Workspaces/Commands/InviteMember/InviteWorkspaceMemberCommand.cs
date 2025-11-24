using MeetUp.Application.Mediator;

namespace MeetUp.Application.Workspaces.Commands.InviteMember;

public record InviteWorkspaceMemberCommand(Guid WorkspaceId, string Email) : ICommand;