using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Application.Meetings.Queries.GetHostedMeetings;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Meetings.Queries.GetInvitedMeetings;

internal sealed class GetInvitedMeetingsQueryHandler(IApplicationDbContext context, IUserContext userContext, IPagedList<MeetingDto> pagedList)
    : IQueryHandler<GetHostedMeetingsQuery, IPagedList<MeetingDto>>
{
    public async Task<Result<IPagedList<MeetingDto>>> Handle(GetHostedMeetingsQuery request, CancellationToken cancellationToken)
    {
        var query = context.Meetings
            .Where(m => m.Participants.Any(p => p.WorkspaceUser.UserId == userContext.UserId) && m.WorkspaceId == request.WorkspaceId)
            .Select(m => new MeetingDto(
                m.Id,
                m.Title,
                m.Description,
                m.ScheduledAt,
                m.Duration,
                m.Participants.Count,
                m.IsActive));

        if (request.SearchTerm != null)
        {
            query = query.Where(m => m.Title.Contains(request.SearchTerm));
        }
        
        var pagedListResult = await pagedList.Create(query, request.Page, request.PageSize);

        return Result<IPagedList<MeetingDto>>.Success(pagedListResult);
    }
}