using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;

namespace MeetUp.Application.Recordings.Queries.GetUserRecordings;

public record GetUserRecordingsQuery : IQuery<GetUserRecordingsQueryResponse>;

public record GetUserRecordingsQueryResponse(ICollection<RecordingDto> Recordings);

public record RecordingDto : FileDto
{
    public TimeSpan Duration { get; init; }
    
    public required string Title { get; init; }
}