using MeetUp.Application.Mediator;

namespace MeetUp.Application.Recordings.Commands.ShareRecord;

public record ShareRecordCommand(IEnumerable<Guid> RecipientIds, string StorageKey) : ICommand;