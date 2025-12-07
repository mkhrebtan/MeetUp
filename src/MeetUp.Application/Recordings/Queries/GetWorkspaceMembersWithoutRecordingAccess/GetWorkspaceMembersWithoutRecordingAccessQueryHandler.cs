using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Recordings.Queries.GetWorkspaceMembersWithoutRecordingAccess;

internal sealed class GetWorkspaceMembersWithoutRecordingAccessQueryHandler(
    IApplicationDbContext context,
    IUserContext userContext) : IQueryHandler<GetWorkspaceMembersWithoutRecordingAccessQuery, ICollection<MemberDto>>
{
    public async Task<Result<ICollection<MemberDto>>> Handle(GetWorkspaceMembersWithoutRecordingAccessQuery request, CancellationToken cancellationToken)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result<ICollection<MemberDto>>.Failure(Error.NotFound("User.NotFound", "User not found."));
        }

        var members = await context.WorkspaceUsers
            .Include(wu => wu.User)
            .Where(wu => wu.WorkspaceId == request.WorkspaceId 
                         && wu.UserId != user.Id
                         && !context.SharedRecords.Any(sr => 
                             sr.RecipientId == wu.UserId 
                             && sr.StorageKey == request.StorageKey 
                             && sr.OwnerId == user.Id))
            .Select(wu => new MemberDto(
                wu.UserId,
                $"{wu.User.FirstName} {wu.User.LastName}",
                wu.User.AvatarUrl
            ))
            .ToListAsync(cancellationToken);

        return Result<ICollection<MemberDto>>.Success(members);
    }
}
