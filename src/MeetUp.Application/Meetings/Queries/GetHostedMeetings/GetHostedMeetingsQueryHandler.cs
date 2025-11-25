using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Meetings.Queries.GetHostedMeetings;

internal sealed class GetHostedMeetingsQueryHandler(IApplicationDbContext context, IUserContext userContext, IPagedList<MeetingDto> pagedList)
    : IQueryHandler<GetHostedMeetingsQuery, IPagedList<MeetingDto>>
{
    public async Task<Result<IPagedList<MeetingDto>>> Handle(GetHostedMeetingsQuery request, CancellationToken cancellationToken)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result<IPagedList<MeetingDto>>.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        var query = context.Meetings
            .Where(m => m.OrganizerId == user.Id && m.WorkspaceId == request.WorkspaceId)
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