using System.Globalization;
using System.Text.RegularExpressions;

namespace MeetUp.Application.Common.Utils;

internal static partial class RecordingUtils
{
    internal static TimeSpan EstimateDuration(string filename, DateTime uploadFinishedTime)
    {
        var match = RecordingTicksRegex().Match(filename);
        if (!match.Success)
        {
            return TimeSpan.Zero;
        }

        var timeStr = match.Groups[1].Value;
        if (!DateTime.TryParseExact(timeStr, "yyyyMMddHHmmss",
                CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var startTime))
        {
            return TimeSpan.Zero;
        }
        
        var duration = uploadFinishedTime.ToUniversalTime() - startTime.ToUniversalTime();
        return duration.TotalSeconds > 0 ? duration : TimeSpan.Zero;
    }
    
    internal static string ExtractMeetingName(string filename)
    {
        var match = RecordingTicksRegex().Match(filename);
        if (!match.Success)
        {
            return filename;
        }

        var meetingName = filename[..(match.Index - 1)];
        return meetingName;
    }
    
    [GeneratedRegex(@"(\d{14})")]
    private static partial Regex RecordingTicksRegex();
}