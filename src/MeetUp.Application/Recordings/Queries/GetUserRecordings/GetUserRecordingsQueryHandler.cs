using System.Globalization;
using System.Text.RegularExpressions;
using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Common.Utils;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Recordings.Queries.GetUserRecordings;

internal sealed class  GetUserRecordingsQueryHandler (
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
            Duration = RecordingUtils.EstimateDuration(file.FileName, file.CreatedAt),
            Title = RecordingUtils.ExtractMeetingName(file.FileName),
        }).ToList();
        
        return Result<GetUserRecordingsQueryResponse>.Success(new GetUserRecordingsQueryResponse(recordingFiles));
    }
}