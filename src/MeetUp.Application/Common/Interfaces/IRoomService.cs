using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Common.Interfaces;

public interface IRoomService
{
    Task<Result<string>> GetAccessToken(User user, Meeting meeting, bool isHost);
    
    Task<Dictionary<Guid, bool>> GetMeetingsStatus(Guid[] meetingIds);
}