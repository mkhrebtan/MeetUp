using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Common.Utils;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Recordings.Queries.GetSharedRecordings;

internal sealed class GetSharedRecordingsQueryHandler (
    IApplicationDbContext context,
    IUserContext userContext) : IQueryHandler<GetSharedRecordingsQuery, GetSharedRecordingsQueryResponse>
{
    public async Task<Result<GetSharedRecordingsQueryResponse>> Handle(GetSharedRecordingsQuery request, CancellationToken cancellationToken)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result<GetSharedRecordingsQueryResponse>.Failure(Error.NotFound("User.NotFound", "User not found."));
        }
        
        var sharedRecords = await context.SharedRecords
            .Where(sr => sr.RecipientId == user.Id)
            .Select(sr => new SharedRecordingDto
            {
                Key = sr.StorageKey,
                FileName = sr.FileName,
                CreatedAt = sr.RecordCreatedAt,
                Duration = RecordingUtils.EstimateDuration(sr.FileName, sr.RecordCreatedAt),
                Title = RecordingUtils.ExtractMeetingName(sr.FileName),
                OwnerName = $"{sr.Owner.FirstName} {sr.Owner.LastName}",
                Views = 0,
            })
            .ToListAsync(cancellationToken);
        
        var recordingKeys = sharedRecords.Select(rf => rf.Key).ToList();
        var recordViews = await context.RecordViews
            .Where(rv => recordingKeys.Contains(rv.RecordingStorageKey))
            .ToDictionaryAsync(rv => rv.RecordingStorageKey, rv => rv.Views, cancellationToken);
        foreach (var recordingFile in sharedRecords)
        {
            if (recordViews.TryGetValue(recordingFile.Key, out var views))
            {
                recordingFile.Views = views;
            }
        }

        return Result<GetSharedRecordingsQueryResponse>.Success(new GetSharedRecordingsQueryResponse(sharedRecords));
    }
}