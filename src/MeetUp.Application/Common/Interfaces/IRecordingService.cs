namespace MeetUp.Application.Common.Interfaces;

public interface IRecordingService
{
    Task<string> StartRecordingAsync(Guid meetingId, Guid userId, string? meetingName = null);
    
    Task StopRecordingAsync(string egressId);
}