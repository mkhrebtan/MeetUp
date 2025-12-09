using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Application.Recordings.Queries.GetUserRecordings;

namespace MeetUp.Application.Recordings.Queries.GetSharedRecordings;

public record GetSharedRecordingsQuery : IQuery<GetSharedRecordingsQueryResponse>;

public record GetSharedRecordingsQueryResponse(ICollection<SharedRecordingDto> Recordings);

public record SharedRecordingDto : RecordingDto
{
    public string OwnerName { get; init; } = null!;
}