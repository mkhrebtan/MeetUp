using MeetUp.Domain.Abstraction;

namespace MeetUp.Domain.Enums;

public abstract class WorkspaceRole : Enumeration<WorkspaceRole>
{
    private WorkspaceRole(string code, string name) : base(code, name)
    {
    }
    
    public static readonly WorkspaceRole Member = new MemberRole();
    public static readonly WorkspaceRole Admin = new AdminRole();
    public static readonly WorkspaceRole NotSet = new NotSetRole();

    private sealed class MemberRole : WorkspaceRole
    {
        internal MemberRole() : base("MEMBER", "Member")
        {
        }
    }

    private sealed class AdminRole : WorkspaceRole
    {
        internal AdminRole() : base("ADMIN", "Admin")
        {
        }
    }

    private sealed class NotSetRole : WorkspaceRole
    {
        internal NotSetRole() : base("NOT_SET", "NotSet")
        {
        }
    }
}