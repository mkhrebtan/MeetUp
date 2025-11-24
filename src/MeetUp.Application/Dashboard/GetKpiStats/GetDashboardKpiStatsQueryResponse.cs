using MeetUp.Application.Mediator;

namespace MeetUp.Application.Dashboard.GetKpiStats;

public record GetDashboardKpiStatsQueryResponse(KpiStat LastWeekMeetings, KpiStat LastWeekTotalHours, KpiStat TotalMembers) : IQuery<GetDashboardKpiStatsQueryResponse>;