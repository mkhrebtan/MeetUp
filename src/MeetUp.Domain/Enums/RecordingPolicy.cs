using MeetUp.Domain.Abstraction;

namespace MeetUp.Domain.Enums;

public abstract class RecordingPolicy : Enumeration<RecordingPolicy>
{
    public static readonly RecordingPolicy HostOnly = new HostOnlyPolicy();
    public static readonly RecordingPolicy AllParticipants = new AllParticipantsPolicy();
    
    private RecordingPolicy(string code, string name) : base(code, name)
    {
    }
    
    private sealed class HostOnlyPolicy : RecordingPolicy
    {
        internal HostOnlyPolicy() : base("HOST_ONLY", "Host Only")
        {
        }
    }
    
    private sealed class AllParticipantsPolicy : RecordingPolicy
    {
        internal AllParticipantsPolicy() : base("ALL_PARTICIPANTS", "All Participants")
        {
        }
    }
}