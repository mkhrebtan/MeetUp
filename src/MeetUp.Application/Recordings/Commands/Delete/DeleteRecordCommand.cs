using MeetUp.Application.Common.Interfaces;
using MeetUp.Application.Mediator;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Application.Recordings.Commands.Delete;

public record DeleteRecordCommand(string StorageKey) : ICommand;

internal sealed class DeleteRecordCommandHandler (
    IStorage storage,
    IApplicationDbContext context) : ICommandHandler<DeleteRecordCommand>
{
    public async Task<Result> Handle(DeleteRecordCommand request, CancellationToken cancellationToken)
    {
        var result = await storage.DeleteFileAsync(request.StorageKey, cancellationToken);
        if (result.IsFailure)
        {
            return result;
        }

        var sharedRecords = await context.SharedRecords
            .Where(sr => sr.StorageKey == request.StorageKey)
            .ToListAsync(cancellationToken);
        
        context.SharedRecords.RemoveRange(sharedRecords);
        await context.SaveChangesAsync(cancellationToken);
        
        return Result.Success();
    }
}
