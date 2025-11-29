using MeetUp.API.Extensions;
using MeetUp.Application.Dashboard.GetKpiStats;
using MeetUp.Application.Dashboard.GetUpcomingMeetings;
using MeetUp.Application.Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetUp.API.Controllers;

public class DashboardController : ApiControllerBase
{
    [HttpGet("kpi-stats")]
    [Authorize]
    public async Task<IResult> GetKpiStats(
        [FromServices] IQueryHandler<GetDashboardKpiStatsQuery, GetDashboardKpiStatsQueryResponse> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GetDashboardKpiStatsQuery(), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }

    [HttpGet("upcoming-meetings")]
    [Authorize]
    public async Task<IResult> GetUpcomingMeetings(
        [FromQuery] int count,
        [FromServices] IQueryHandler<GetUpcomingMeetingsQuery, IEnumerable<Application.Meetings.Queries.MeetingDto>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.Handle(new GetUpcomingMeetingsQuery(count), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.GetProblem();
    }
}