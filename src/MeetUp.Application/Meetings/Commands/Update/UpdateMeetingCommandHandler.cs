using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Meetings.Commands.Update;

internal sealed class UpdateMeetingCommandHandler(IApplicationDbContext context, IUserContext userContext) : ICommandHandler<UpdateMeetingCommand>
{
    public async Task<Result> Handle(UpdateMeetingCommand request, CancellationToken cancellationToken = default)
    {
        var meeting = await context.Meetings.FindAsync([request.WorkspaceId,], cancellationToken: cancellationToken);
        if (meeting is null)
        {
            return Result.Failure(Error.NotFound("Meeting.NotFound", "Meeting not found."));
        }

        if (meeting.OrganizerId != userContext.UserId)
        {
            return Result.Failure(Error.Forbidden("Meeting.NotOrganizer", "Only the organizer can update the meeting."));
        }
        
        var screenSharePolicy = ScreenSharePolicy.FromCode(request.ScreenSharePolicy);
        if (screenSharePolicy is null)
        {
            return Result.Failure(Error.Problem("Meeting.InvalidScreenSharePolicy", "Invalid screen share policy."));
        }

        var recordingPolicy = RecordingPolicy.FromCode(request.RecordingPolicy);
        if (recordingPolicy is null)
        {
            return Result.Failure(Error.Problem("Meeting.InvalidRecordingPolicy", "Invalid recording policy."));
        }

        var chatPolicy = ChatPolicy.FromCode(request.ChatPolicy);
        if (chatPolicy is null)
        {
            return Result.Failure(Error.Problem("Meeting.InvalidChatPolicy", "Invalid chat policy."));
        }
        
        meeting.Title = request.Title;
        meeting.Description = request.Description;
        meeting.ScheduledAt = request.ScheduledAt;
        meeting.Duration = request.Duration;
        meeting.ScreenSharePolicy = screenSharePolicy;
        meeting.RecordingPolicy = recordingPolicy;
        meeting.ChatPolicy = chatPolicy;

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();

    }
}