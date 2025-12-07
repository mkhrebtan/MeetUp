using MeetUp.Domain.Abstraction;

namespace MeetUp.Domain.Models;

public class RecordViews : Model
{
    public required string RecordingStorageKey { get; set; }

    public int Views { get; set; }
}