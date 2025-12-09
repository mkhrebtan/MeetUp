using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Rooms.Commands.AccessToken;

internal sealed class GetRoomAccessTokenCommandHandler(
    IApplicationDbContext context,
    IUserContext userContext,
    IRoomService roomService) : ICommandHandler<GetRoomAccessTokenCommand, GetAccessTokenCommandResponse>
{
    public async Task<Result<GetAccessTokenCommandResponse>> Handle(GetRoomAccessTokenCommand command, CancellationToken cancellationToken = default)
    {
        var meeting = await context.Meetings.FirstOrDefaultAsync(m => m.Id == command.MeetingId, cancellationToken);
        if (meeting is null)
        {
            return Result<GetAccessTokenCommandResponse>.Failure(Error.NotFound("Meeting.NotFound", "Meeting not found."));
        }

        var workspaceUser = await context.WorkspaceUsers
            .Include(w => w.User)
            .FirstOrDefaultAsync(wu => wu.User.Email == userContext.Email, cancellationToken);
        if (workspaceUser is null)
        {
            return Result<GetAccessTokenCommandResponse>.Failure(Error.Problem("WorkspaceUser.NotFound", "Workspace user not found."));
        }

        var tokenResult = await roomService.GetAccessToken(workspaceUser.User, meeting, meeting.OrganizerId == workspaceUser.Id);
        return tokenResult.IsFailure ? Result<GetAccessTokenCommandResponse>.Failure(tokenResult.Error) : Result<GetAccessTokenCommandResponse>.Success(new GetAccessTokenCommandResponse(tokenResult.Value));
    }
}