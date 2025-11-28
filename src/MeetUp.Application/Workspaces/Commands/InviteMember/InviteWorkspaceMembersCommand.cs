using MeetUp.Application.Mediator;

namespace MeetUp.Application.Workspaces.Commands.InviteMember;

public record InviteWorkspaceMembersCommand(Guid WorkspaceId, string[] Emails) : ICommand;