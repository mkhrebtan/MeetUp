using MeetUp.Application.Mediator;

namespace MeetUp.Application.Recordings.Queries.GetRecordingUrl;

public record GetRecordingUrlQuery(string RecordingKey) : IQuery<GetRecordingUrlQueryResponse>;

public record GetRecordingUrlQueryResponse(string Url);