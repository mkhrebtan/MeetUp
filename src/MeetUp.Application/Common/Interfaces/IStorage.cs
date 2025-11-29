using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Common.Interfaces;

public interface IStorage
{
    Task<string> GetFileUploadUrlAsync(string fileName, string contentType, CancellationToken cancellationToken = default);
    
    Task<Result> DeleteFileAsync(Guid key);
}