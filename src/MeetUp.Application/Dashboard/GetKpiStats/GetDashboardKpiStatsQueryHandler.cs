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
        var totalMeetingsLastWeek = await context.Meetings
            .Where(m => 
                (m.OrganizerId == userContext.UserId || m.Participants.Any(p => p.UserId == userContext.UserId)) &&
                m.ScheduledAt >= DateTime.UtcNow.AddDays(-7))
            .CountAsync(cancellationToken);

        var totalHoursLastWeek = await context.Meetings
            .Where(m => (m.OrganizerId == userContext.UserId || m.Participants.Any(p => p.UserId == userContext.UserId)) &&
                        m.ScheduledAt >= DateTime.UtcNow.AddDays(-7))
            .SumAsync(m => m.Duration.TotalHours, cancellationToken);


        var totalMembers = await context.Users.CountAsync(cancellationToken);

        var weekMeetingsKpi = new KpiStat(totalMeetingsLastWeek, "Meetings Last 7 Days");
        var totalHoursKpi = new KpiStat((decimal)totalHoursLastWeek, "Total Hours Last 7 Days");
        var totalMembersKpi = new KpiStat(totalMembers, "Total Members");

        return Result<GetDashboardKpiStatsQueryResponse>.Success(
            new GetDashboardKpiStatsQueryResponse(weekMeetingsKpi, totalHoursKpi, totalMembersKpi));
    }
}