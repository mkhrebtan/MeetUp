using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Recordings.Queries.GetRecordingUrl;

internal sealed class GetRecordingUrlQueryHandler(IStorage storage) : IQueryHandler<GetRecordingUrlQuery, GetRecordingUrlQueryResponse>
{
    public async Task<Result<GetRecordingUrlQueryResponse>> Handle(GetRecordingUrlQuery request, CancellationToken cancellationToken)
    {
        var url = await storage.GetFileUrlAsync(request.RecordingKey, DateTime.Now.AddHours(2), cancellationToken);
        return Result<GetRecordingUrlQueryResponse>.Success(new GetRecordingUrlQueryResponse(url));
    }
}