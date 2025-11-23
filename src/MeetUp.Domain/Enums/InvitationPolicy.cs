using MeetUp.Domain.Abstraction;

namespace MeetUp.Domain.Enums;

public abstract class InvitationPolicy : Enumeration<InvitationPolicy>
{
    public static readonly InvitationPolicy AllMembers = new AllMembersPolicy();
    public static readonly InvitationPolicy OnlyAdmins = new OnlyAdminsPolicy();
    
    private InvitationPolicy(string code, string name) : base(code, name)
    {
    }
    
    private sealed class AllMembersPolicy : InvitationPolicy
    {
        internal AllMembersPolicy() : base("ALL_MEMBERS", "All members")
        {
        }
    }
    
    private sealed class OnlyAdminsPolicy : InvitationPolicy
    {
        internal OnlyAdminsPolicy() : base("ONLY_ADMINS", "Only organizers")
        {
        }
    }
}