using MeetUp.Domain.Abstraction;

namespace MeetUp.Domain.Enums;

public abstract class ScreenSharePolicy : Enumeration<ScreenSharePolicy>
{
    public static readonly ScreenSharePolicy HostOnly = new HostOnlyPolicy();
    public static readonly ScreenSharePolicy AllParticipants = new AllParticipantsPolicy();
    
    private ScreenSharePolicy(string code, string name) : base(code, name)
    {
    }
    
    private sealed class HostOnlyPolicy : ScreenSharePolicy
    {
        internal HostOnlyPolicy() : base("HOST_ONLY", "Host Only")
        {
        }
    }
    
    private sealed class AllParticipantsPolicy : ScreenSharePolicy
    {
        internal AllParticipantsPolicy() : base("ALL_PARTICIPANTS", "All Participants")
        {
        }
    }
}