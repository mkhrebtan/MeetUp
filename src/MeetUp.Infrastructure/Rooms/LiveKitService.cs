using System.Text.Json;
using Livekit.Server.Sdk.Dotnet;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Domain.Enums;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.Extensions.Options;

namespace MeetUp.Infrastructure.Rooms;

public class LiveKitService(IOptions<LiveKitSettings> settings) : IRoomService
{
    private readonly RoomServiceClient _roomServiceClient = new RoomServiceClient(settings.Value.Url, settings.Value.ApiKey, settings.Value.ApiSecret);
    
    public async Task<Result<string>> GetAccessToken(User user, Meeting meeting, bool isHost)
    {
        var roomExists = await RoomExistsAsync(meeting.Id);
        switch (roomExists)
        {
            case false when !isHost:
                return Result<string>.Failure(Error.NotFound("Room.NotFound", "Room not found."));
            case false when isHost:
                await CreateRoom(meeting);
                break;
        }

        var token = new AccessToken(settings.Value.ApiKey, settings.Value.ApiSecret)
            .WithIdentity(user.Id.ToString())
            .WithName($"{user.FirstName} {user.LastName}")
            .WithGrants(new VideoGrants
            {
                RoomJoin = !isHost,
                Room = meeting.Id.ToString(),
                RoomAdmin = isHost,
                RoomRecord = isHost,
                RoomCreate = isHost,
            })
            .WithTtl(TimeSpan.FromMinutes(settings.Value.AccessTokenExpiresInMinutes));
        var jwt = token.ToJwt();
        return Result<string>.Success(jwt);
    }

    public async Task<Dictionary<Guid, bool>> GetMeetingsStatus(Guid[] meetingIds)
    {
        var request = new ListRoomsRequest
        {
            Names = { meetingIds.Select(m => m.ToString()).ToArray(), },
        };
        var rooms = await _roomServiceClient.ListRooms(request);

        return meetingIds.ToDictionary(meetingId => meetingId, meetingId => rooms.Rooms.Any(r => r.Name == meetingId.ToString()));
    }

    private async Task<bool> RoomExistsAsync(Guid meetingId)
    {
        var request = new ListRoomsRequest
        {
            Names = { meetingId.ToString(), },
        };
        var room = await _roomServiceClient.ListRooms(request);
        return room.Rooms.Any(r => r.Name == meetingId.ToString());
    }

    private async Task CreateRoom(Meeting meeting)
    {
        var request = new CreateRoomRequest
        {
            Name = meeting.Id.ToString(),
            Metadata = JsonSerializer.Serialize(new RoomMetadata
            {
                RoomName = meeting.Title,
                ChatEnabled = meeting.ChatPolicy.Equals(ChatPolicy.Enabled),
                ScreenShareEnabled = meeting.ScreenSharePolicy.Equals(ScreenSharePolicy.AllParticipants),
            }),
        };
        await _roomServiceClient.CreateRoom(request);
    }
}

internal record RoomMetadata
{
    internal required string RoomName { get; init; }
    
    internal bool ChatEnabled { get; init; } = false;
    
    internal bool ScreenShareEnabled { get; init; } = false;
};