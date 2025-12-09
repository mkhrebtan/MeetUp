using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Recordings.Commands.ShareRecord;

internal sealed class ShareRecordCommandHandler (
    IApplicationDbContext context,
    IStorage storage,
    IUserContext userContext) : ICommandHandler<ShareRecordCommand>
{
    public async Task<Result> Handle(ShareRecordCommand request, CancellationToken cancellationToken)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == userContext.Email, cancellationToken);
        if (user is null)
        {
            return Result.Failure(Error.NotFound("User.NotFound", "User not found."));
        }
        
        var existingSharedRecords = await context.SharedRecords
            .Where(sr => sr.OwnerId == user.Id && sr.StorageKey == request.StorageKey && request.RecipientIds.Contains(sr.RecipientId))
            .ToListAsync(cancellationToken);
        if (existingSharedRecords.Count != 0)
        {
            return Result.Failure(Error.Conflict("Record.AlreadyShared", "Record already shared with some of the recipients."));
        }
        
        var recordingFile = await storage.GetFileAsync(request.StorageKey, cancellationToken);
        foreach (var recipientId in request.RecipientIds)
        {
            var sharedRecord = new SharedRecord()
            {
                Id = Guid.NewGuid(),
                OwnerId = user.Id,
                RecipientId = recipientId,
                StorageKey = request.StorageKey,
                FileName = recordingFile.FileName,
                RecordCreatedAt = recordingFile.CreatedAt,
            };
            context.SharedRecords.Add(sharedRecord);
        }
        
        await context.SaveChangesAsync(cancellationToken);
        
        return Result.Success();
    }
}