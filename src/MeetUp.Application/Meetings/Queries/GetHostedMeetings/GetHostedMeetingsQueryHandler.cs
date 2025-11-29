using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Meetings.Queries.GetHostedMeetings;

internal sealed class GetHostedMeetingsQueryHandler(
    IApplicationDbContext context,
    IUserContext userContext,
    IPagedList<MeetingDto> pagedList,
    IRoomService roomService)
    : IQueryHandler<GetHostedMeetingsQuery, IPagedList<MeetingDto>>
{
    public async Task<Result<IPagedList<MeetingDto>>> Handle(GetHostedMeetingsQuery request, CancellationToken cancellationToken)
    {
        var user = await context.WorkspaceUsers
            .Include(wu => wu.User)
            .FirstOrDefaultAsync(wu => wu.WorkspaceId == request.WorkspaceId && wu.User.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result<IPagedList<MeetingDto>>.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        var query = context.Meetings
            .Where(m => m.OrganizerId == user.Id && m.WorkspaceId == request.WorkspaceId);
        
        query = request.Passed ? query.Where(m => m.ScheduledAt < DateTime.UtcNow) : query.Where(m => m.ScheduledAt >= DateTime.UtcNow);
        
        if (request.SearchTerm != null)
        {
            query = query.Where(m => m.Title.Contains(request.SearchTerm));
        }
        
        var dtos = query
            .Select(m => new MeetingDto(
                m.Id,
                m.Title,
                m.Description,
                m.ScheduledAt,
                m.Duration,
                m.Participants.Count,
                m.InviteCode));

        var dtosPagedList = await pagedList.Create(dtos, request.Page, request.PageSize);

        var meetingsStatus = await roomService.GetMeetingsStatus(dtosPagedList.Items.Select(m => m.Id).ToArray());
        dtosPagedList.Items.ForEach(m => m.IsActive = meetingsStatus[m.Id]);
        
        return Result<IPagedList<MeetingDto>>.Success(dtosPagedList);
    }
}