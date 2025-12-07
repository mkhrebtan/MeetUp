using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Common.Interfaces;

public interface IStorage
{
    Task<string> GetFileUploadUrlAsync(string fileName, string contentType, CancellationToken cancellationToken = default);
    
    Task<Result> DeleteFileAsync(Guid key);
    
    Task<ICollection<FileDto>> ListFilesAsync(string prefix, List<string>? fileExtensions = null, CancellationToken cancellationToken = default);
    
    Task<string> GetFileUrlAsync(string key, DateTime? expires = null, CancellationToken cancellationToken = default);
}

public record FileDto
{
    public string Key { get; init; } = null!;
    
    public string FileName { get; init; } = null!;
    
    public DateTime CreatedAt { get; init; }
    
    public string MetaData { get; init; } = string.Empty;
}