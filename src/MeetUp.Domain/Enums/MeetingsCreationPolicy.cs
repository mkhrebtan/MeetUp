using MeetUp.Domain.Abstraction;

namespace MeetUp.Domain.Enums;

public class MeetingsCreationPolicy : Enumeration<MeetingsCreationPolicy>
{
    public static readonly MeetingsCreationPolicy AllMembers = new AllMembersPolicy();
    public static readonly MeetingsCreationPolicy OnlyAdmins = new OnlyAdminsPolicy();
    
    private MeetingsCreationPolicy(string code, string name) : base(code, name)
    {
    }
    
    private sealed class AllMembersPolicy : MeetingsCreationPolicy
    {
        internal AllMembersPolicy() : base("ALL_MEMBERS", "All members")
        {
        }
    }
    
    private sealed class OnlyAdminsPolicy : MeetingsCreationPolicy
    {
        internal OnlyAdminsPolicy() : base("ONLY_ADMINS", "Only organizers")
        {
        }
    }
}