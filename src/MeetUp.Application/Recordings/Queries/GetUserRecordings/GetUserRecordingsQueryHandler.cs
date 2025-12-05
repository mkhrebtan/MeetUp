using System.Globalization;
using System.Text.RegularExpressions;
using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Recordings.Queries.GetUserRecordings;

internal sealed partial class  GetUserRecordingsQueryHandler (
    IStorage storage,
    IUserContext currentUserService) : IQueryHandler<GetUserRecordingsQuery, GetUserRecordingsQueryResponse>
{
    public async Task<Result<GetUserRecordingsQueryResponse>> Handle(GetUserRecordingsQuery request, CancellationToken cancellationToken)
    {
        var prefix = $"recordings/{currentUserService.UserId}/";
        var files = await storage.ListFilesAsync(prefix, [".mp4"], cancellationToken);
        var recordingFiles = files.Select(file => new RecordingDto
        {
            Key = file.Key,
            FileName = file.FileName,
            CreatedAt = file.CreatedAt,
            Duration = EstimateDuration(file.FileName, file.CreatedAt),
        }).ToList();
        
        return Result<GetUserRecordingsQueryResponse>.Success(new GetUserRecordingsQueryResponse(recordingFiles));
    }
    
    private static TimeSpan EstimateDuration(string filename, DateTime uploadFinishedTime)
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

    [GeneratedRegex(@"(\d{14})")]
    private static partial Regex RecordingTicksRegex();
}