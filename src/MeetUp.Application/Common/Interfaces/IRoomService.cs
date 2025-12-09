using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Common.Interfaces;

public interface IRoomService
{
    Task<Result<string>> GetAccessToken(User user, Meeting meeting, bool isHost);
    
    Task<Dictionary<Guid, bool>> GetMeetingsStatus(Guid[] meetingIds);

    Task<Result> UpdateRoomMetadata(Guid meetingId, RoomMetadata metadata);

    Task<Result> DeleteRoom(Guid meetingId);
    
    Task<Result> RemoveParticipant(string room, string participant);
}

public record RoomMetadata
{
    public required string RoomName { get; init; }
    
    public bool ChatEnabled { get; init; } = false;
    
    public bool ScreenShareEnabled { get; init; } = false;
};