using MeetUp.Application.Mediator;
using MeetUp.Application.Meetings.Queries;

namespace MeetUp.Application.Meetings.Commands.AddParticipant;

public record AddMeetingParticipantCommand(IEnumerable<Guid> UserIds, Guid MeetingId) : ICommand<MeetingDto>;