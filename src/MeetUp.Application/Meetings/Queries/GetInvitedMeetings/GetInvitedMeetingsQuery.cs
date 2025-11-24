using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;

namespace MeetUp.Application.Meetings.Queries.GetInvitedMeetings;

public record GetInvitedMeetingsQuery(Guid WorkspaceId, string? SearchTerm, int Page, int PageSize) : IQuery<IPagedList<MeetingDto>>;