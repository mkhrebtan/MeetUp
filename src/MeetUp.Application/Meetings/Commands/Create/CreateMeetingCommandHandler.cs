using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Meetings.Commands.Create;

internal class CreateMeetingCommandHandler(IApplicationDbContext context, IUserContext userContext, IInviteCodeGenerator codeGenerator)
    : ICommandHandler<CreateMeetingCommand, CreateMeetingCommandResponse>
{
    public async Task<Result<CreateMeetingCommandResponse>> Handle(CreateMeetingCommand request, CancellationToken cancellationToken)
    {
        var screenSharePolicy = ScreenSharePolicy.FromCode(request.ScreenSharePolicy);
        if (screenSharePolicy is null)
        {
            return Result<CreateMeetingCommandResponse>.Failure(Error.Problem("Meeting.InvalidScreenSharePolicy", "Invalid screen share policy."));
        }

        var recordingPolicy = RecordingPolicy.FromCode(request.RecordingPolicy);
        if (recordingPolicy is null)
        {
            return Result<CreateMeetingCommandResponse>.Failure(Error.Problem("Meeting.InvalidRecordingPolicy", "Invalid recording policy."));
        }

        var chatPolicy = ChatPolicy.FromCode(request.ChatPolicy);
        if (chatPolicy is null)
        {
            return Result<CreateMeetingCommandResponse>.Failure(Error.Problem("Meeting.InvalidChatPolicy", "Invalid chat policy."));
        }   
        
        var meeting = new Meeting
        {
            Title = request.Title,
            Description = request.Description,
            ScheduledAt = request.ScheduledAt,
            Duration = request.Duration,
            WorkspaceId = request.WorkspaceId,
            ScreenSharePolicy = screenSharePolicy,
            RecordingPolicy = recordingPolicy,
            ChatPolicy = chatPolicy,
            OrganizerId = userContext.UserId,
            InviteCode = await GetUniqueInviteCode(),
        };

        context.Meetings.Add(meeting);
        await context.SaveChangesAsync(cancellationToken);

        return Result<CreateMeetingCommandResponse>.Success(new CreateMeetingCommandResponse(meeting.Id));
    }
    
    private async Task<string> GetUniqueInviteCode()
    {
        string code;
        bool isUnique;
        do
        {
            code = codeGenerator.Generate();
            var exists = await context.Workspaces.AnyAsync(w => w.Name == code);
            isUnique = !exists;
        } while (!isUnique);
        
        return code;
    }
}