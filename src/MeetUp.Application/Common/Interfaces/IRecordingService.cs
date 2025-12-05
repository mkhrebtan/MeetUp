namespace MeetUp.Application.Common.Interfaces;

public interface IRecordingService
{
    Task<string> StartRecordingAsync(Guid meetingId, Guid userId);
    
    Task StopRecordingAsync(string egressId);
}