using Livekit.Server.Sdk.Dotnet;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Infrastructure.Storage;
using Microsoft.Extensions.Options;

namespace MeetUp.Infrastructure.Rooms;

public class EgressService(IOptions<LiveKitSettings> settings, IOptions<S3Settings> s3Settings) : IRecordingService
{
    private readonly EgressServiceClient _egressClient = new EgressServiceClient(
        settings.Value.Url,
        settings.Value.ApiKey,
        settings.Value.ApiSecret);

    public async Task<string> StartRecordingAsync(Guid meetingId, Guid userId)
    {
        var request = new RoomCompositeEgressRequest
        {
            RoomName = meetingId.ToString(),
            Layout = "grid",
            FileOutputs =
            {
                new EncodedFileOutput
                {
                    FileType = EncodedFileType.Mp4,
                    Filepath = $"recordings/{userId}/recording-{DateTime.UtcNow:yyyyMMddHHmmss}.mp4",
                    S3 = new S3Upload
                    {
                        Bucket = s3Settings.Value.BucketName,
                        Region = s3Settings.Value.Region,
                        AccessKey = s3Settings.Value.AccessKey,
                        Secret = s3Settings.Value.SecretKey,
                    },
                },
            },
            
        };
        
        var info = await _egressClient.StartRoomCompositeEgress(request);
        return info.EgressId;
    }
    
    public async Task StopRecordingAsync(string egressId)
    {
        var request = new StopEgressRequest
        {
            EgressId = egressId,
        };
        await _egressClient.StopEgress(request);
    }
}