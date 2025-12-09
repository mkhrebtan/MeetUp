using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Meetings.Queries.GetPossibleTimeQuery;

internal sealed class GetPossibleMeetingTimeQueryHandler(IApplicationDbContext context) : IQueryHandler<GetPossibleMeetingTimeQuery, IEnumerable<Interval>>
{
    public async Task<Result<IEnumerable<Interval>>> Handle(GetPossibleMeetingTimeQuery query, CancellationToken cancellationToken = default)
    {
        var workspaceUsers = await context.WorkspaceUsers
            .Where(wu => query.MembersIds.Contains(wu.UserId))
            .ToListAsync(cancellationToken);

        if (workspaceUsers.Count != query.MembersIds.Count)
        {
            return Result<IEnumerable<Interval>>.Failure(Error.NotFound("WorkspaceUser.NotFound", "One or more workspace users not found."));
        }

        var meetings = await context.Meetings
            .Where(m => m.ScheduledAt.Date == query.ScheduledAt.Date)
            .Where(m => query.MembersIds.Contains(m.OrganizerId) || m.Participants.Any(p => query.MembersIds.Contains(p.WorkspaceUser.UserId)))
            .Select(m => new { m.ScheduledAt, m.Duration })
            .ToListAsync(cancellationToken);

        var busyIntervals = meetings
            .Select(m => new Interval(m.ScheduledAt, m.ScheduledAt.Add(m.Duration)))
            .ToList();

        var mergedIntervals = MergeIntervals(busyIntervals);
        
        var startTimes = FindFreeSlots(
            mergedIntervals,
            query.EarliestStart,
            query.LatestEnd,
            TimeSpan.FromMinutes(query.DurationInMinutes),
            maxSlots: 3);

        if (startTimes.Count == 0)
        {
            return Result<IEnumerable<Interval>>.Failure(Error.NotFound("Meeting.NoPossibleTime", "No possible time found for the meeting."));
        }
        
        var resultIntervals = startTimes
            .Select(start => new Interval(start, start.AddMinutes(query.DurationInMinutes)))
            .ToList();
        
        return Result<IEnumerable<Interval>>.Success(resultIntervals);
    }
    
    private static List<Interval> MergeIntervals(List<Interval> intervals)
    {
        if (intervals.Count == 0) return [];

        var sortedIntervals = intervals
            .OrderBy(i => i.Start)
            .ThenBy(i => i.End)
            .ToList();

        var merged = new List<Interval> { sortedIntervals[0] };
        foreach (var current in sortedIntervals.Skip(1))
        {
            var last = merged.Last();
            if (current.Start <= last.End)
            {
                if (current.End > last.End)
                {
                    merged[^1] = new Interval(last.Start, current.End);
                }
            }
            else
            {
                merged.Add(current);
            }
        }

        return merged;
    }
    
    private static List<DateTime> FindFreeSlots(
        List<Interval> busyIntervals,
        DateTime earliest,
        DateTime latest,
        TimeSpan duration,
        int maxSlots)
    {
        var validSlots = new List<DateTime>();
        var cursor = earliest;
        
        foreach (var block in busyIntervals)
        {
            while (cursor + duration <= block.Start)
            {
                validSlots.Add(cursor);
            
                if (validSlots.Count >= maxSlots) 
                    return validSlots;

                cursor += duration;
            }

            if (cursor < block.End)
            {
                cursor = block.End;
            }
        }
        
        while (cursor + duration <= latest)
        {
            validSlots.Add(cursor);

            if (validSlots.Count >= maxSlots) 
                return validSlots;

            cursor += duration;
        }

        return validSlots;
    }
}