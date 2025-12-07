using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Common.Utils;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Recordings.Queries.GetSharedRecordings;

internal sealed class GetSharedRecordingsQueryHandler (
    IApplicationDbContext context,
    IStorage storage,
    IUserContext currentUserService) : IQueryHandler<GetSharedRecordingsQuery, GetSharedRecordingsQueryResponse>
{
    public async Task<Result<GetSharedRecordingsQueryResponse>> Handle(GetSharedRecordingsQuery request, CancellationToken cancellationToken)
    {
        var sharedRecords = await context.SharedRecords
            .Where(sr => sr.RecipientId == currentUserService.UserId)
            .Select(sr => new RecordingDto
            {
                Key = sr.StorageKey,
                FileName = sr.FileName,
                CreatedAt = sr.RecordCreatedAt,
                Duration = RecordingUtils.EstimateDuration(sr.FileName, sr.RecordCreatedAt),
                Title = RecordingUtils.ExtractMeetingName(sr.FileName),
            })
            .ToListAsync(cancellationToken);

        return Result<GetSharedRecordingsQueryResponse>.Success(new GetSharedRecordingsQueryResponse(sharedRecords));
    }
}