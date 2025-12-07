using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Recordings.Queries.GetRecordingUrl;

internal sealed class GetRecordingUrlQueryHandler(IApplicationDbContext context, IStorage storage) : IQueryHandler<GetRecordingUrlQuery, GetRecordingUrlQueryResponse>
{
    public async Task<Result<GetRecordingUrlQueryResponse>> Handle(GetRecordingUrlQuery request,
        CancellationToken cancellationToken)
    {
        var url = await storage.GetFileUrlAsync(request.RecordingKey, DateTime.Now.AddHours(2), cancellationToken);

        var recordingViews = await context.RecordViews
            .FirstOrDefaultAsync(rv => rv.RecordingStorageKey == request.RecordingKey,
                cancellationToken: cancellationToken);
        if (recordingViews is null)
        {
            recordingViews = new RecordViews
            {
                RecordingStorageKey = request.RecordingKey,
                Views = 1,
            };
            await context.RecordViews.AddAsync(recordingViews, cancellationToken);
        }
        else
        {
            recordingViews.Views++;
        }
        
        await context.SaveChangesAsync(cancellationToken);
        
        return Result<GetRecordingUrlQueryResponse>.Success(new GetRecordingUrlQueryResponse(url));
    }
}