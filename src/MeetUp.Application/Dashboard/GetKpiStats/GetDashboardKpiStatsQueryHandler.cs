using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Dashboard.GetKpiStats;

internal sealed class GetDashboardKpiStatsQueryHandler(IApplicationDbContext context, IUserContext userContext)
    : IQueryHandler<GetDashboardKpiStatsQuery, GetDashboardKpiStatsQueryResponse>
{
    public async Task<Result<GetDashboardKpiStatsQueryResponse>> Handle(GetDashboardKpiStatsQuery request, CancellationToken cancellationToken)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result<GetDashboardKpiStatsQueryResponse>.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        var workspaceUser = await context.WorkspaceUsers
            .Where(w => w.UserId == user.Id)
            .FirstOrDefaultAsync(cancellationToken);
        if (workspaceUser == null)
        {
            return Result<GetDashboardKpiStatsQueryResponse>.Failure(Error.Problem("WorkspaceUser.NotFound",
                "User is not part of any workspace"));
        }

        var totalMeetingsLastWeek = await context.Meetings
            .Where(m => 
                (m.OrganizerId == user.Id || m.Participants.Any(p => p.WorkspaceUser.UserId == user.Id)) &&
                m.ScheduledAt >= DateTime.UtcNow.AddDays(-7))
            .CountAsync(cancellationToken);

        var totalHoursLastWeek = await context.Meetings
            .Where(m => (m.OrganizerId == user.Id || m.Participants.Any(p => p.WorkspaceUser.UserId == user.Id)) &&
                        m.ScheduledAt >= DateTime.UtcNow.AddDays(-7))
            .SumAsync(m => m.Duration.TotalHours, cancellationToken);


        var totalMembers = await context.WorkspaceUsers.Where(w => w.WorkspaceId == workspaceUser.WorkspaceId)
            .CountAsync(cancellationToken);

        var weekMeetingsKpi = new KpiStat(totalMeetingsLastWeek, "Meetings Last 7 Days");
        var totalHoursKpi = new KpiStat((decimal)totalHoursLastWeek, "Total Hours Last 7 Days");
        var totalMembersKpi = new KpiStat(totalMembers, "Total Members");

        return Result<GetDashboardKpiStatsQueryResponse>.Success(
            new GetDashboardKpiStatsQueryResponse(weekMeetingsKpi, totalHoursKpi, totalMembersKpi));
    }
}