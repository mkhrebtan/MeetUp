using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Common.Utils;
using MeetUp.Application.Mediator;
using MeetUp.Application.Recordings.Queries.GetUserRecordings;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Dashboard.GetRecentRecords;

public record GetRecentRecordsQuery(int Count) : IQuery<IEnumerable<RecordingDto>>;

internal sealed class GetRecentRecordsQueryHandler (
    IApplicationDbContext context,
    IStorage storage,
    IUserContext currentUserService) : IQueryHandler<GetRecentRecordsQuery, IEnumerable<RecordingDto>>
{
    public async Task<Result<IEnumerable<RecordingDto>>> Handle(GetRecentRecordsQuery request, CancellationToken cancellationToken)
    {
        var prefix = $"recordings/{currentUserService.UserId}/";
        var files = await storage.ListFilesAsync(prefix, [".mp4"], request.Count, cancellationToken);
        var recordingFiles = files.Select(file => new RecordingDto
        {
            Key = file.Key,
            FileName = file.FileName,
            CreatedAt = file.CreatedAt,
            Duration = RecordingUtils.EstimateDuration(file.FileName, file.CreatedAt),
            Title = RecordingUtils.ExtractMeetingName(file.FileName),
            Views = 0,
        }).ToList();
        
        var recordingKeys = recordingFiles.Select(rf => rf.Key).ToList();
        var recordViews = context.RecordViews
            .Where(rv => recordingKeys.Contains(rv.RecordingStorageKey))
            .ToDictionary(rv => rv.RecordingStorageKey, rv => rv.Views);
        foreach (var recordingFile in recordingFiles)
        {
            if (recordViews.TryGetValue(recordingFile.Key, out var views))
            {
                recordingFile.Views = views;
            }
        }
        
        return Result<IEnumerable<RecordingDto>>.Success(recordingFiles);
    }
}
