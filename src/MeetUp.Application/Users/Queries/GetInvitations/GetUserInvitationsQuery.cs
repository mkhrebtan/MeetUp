using MeetUp.Application.Mediator;
using MeetUp.Application.Workspaces.Queries.GetMembers;

namespace MeetUp.Application.Users.Queries.GetInvitations;

public record GetUserInvitationsQuery() : IQuery<IEnumerable<InvitationDto>>;

public record InvitationDto(string WorkspaceName, string InviteCode, DateTime CreatedAt);