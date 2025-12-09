using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;

namespace MeetUp.Application.Meetings.Queries.GetHostedMeetings;

public record GetHostedMeetingsQuery(Guid WorkspaceId, string? SearchTerm, int Page, int PageSize, bool Passed) : IQuery<IPagedList<MeetingDto>>;