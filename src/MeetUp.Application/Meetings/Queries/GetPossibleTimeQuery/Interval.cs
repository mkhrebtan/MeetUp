namespace MeetUp.Application.Meetings.Queries.GetPossibleTimeQuery;

public record Interval
{
    public DateTime Start { get; }

    public DateTime End { get; }

    public Interval(DateTime start, DateTime end)
    {
        if (start >= end)
        {
            throw new ArgumentException("Start time must be earlier than end time.");
        }

        Start = start;
        End = end;
    }
}