using MeetUp.Domain.Abstraction;

namespace MeetUp.Domain.Enums;

public abstract class ChatPolicy : Enumeration<ChatPolicy>
{
    public static readonly ChatPolicy Disabled = new DisabledPolicy();
    public static readonly ChatPolicy Enabled = new EnabledPolicy();
    
    private ChatPolicy(string code, string name) : base(code, name)
    {
    }
    
    private sealed class DisabledPolicy : ChatPolicy
    {
        internal DisabledPolicy() : base("DISABLED", "Disabled")
        {
        }
    }
    
    private sealed class EnabledPolicy : ChatPolicy
    {        internal EnabledPolicy() : base("ENABLED", "Enabled")
        {
        }
    }
}