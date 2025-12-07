using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;

namespace MeetUp.Application.Recordings.Queries.GetSharedRecordings;

public record GetSharedRecordingsQuery : IQuery<GetSharedRecordingsQueryResponse>;

public record GetSharedRecordingsQueryResponse(ICollection<RecordingDto> Recordings);

public record RecordingDto : FileDto
{
    public TimeSpan Duration { get; init; }
    
    public required string Title { get; init; }
}