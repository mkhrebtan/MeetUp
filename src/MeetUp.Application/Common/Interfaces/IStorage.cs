namespace MeetUp.Application.Common.Interfaces;

public interface IStorage
{
    Task<string> GetFileUploadUrlAsync(string fileName, string contentType, CancellationToken cancellationToken = default);
}