using Amazon.S3;
using Amazon.S3.Model;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Domain.Shared.ErrorHandling;
using Microsoft.Extensions.Options;

namespace MeetUp.Infrastructure.Storage;

internal sealed class S3Storage(IAmazonS3 s3Client, IOptions<S3Settings> s3Settings) : IStorage
{
    public async Task<string> GetFileUploadUrlAsync(string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var key = Guid.NewGuid();
        var request = new GetPreSignedUrlRequest
        {
            BucketName = s3Settings.Value.BucketName,
            Key = $"meetup/{key}",
            Verb = HttpVerb.PUT,
            Expires = DateTime.Now.AddHours(1),
            ContentType = contentType,
            Metadata =
            {
                ["file-name"] = fileName,
            },
        };

        return await s3Client.GetPreSignedURLAsync(request);
    }

    public async Task<Result> DeleteFileAsync(Guid key)
    {
        var request = new DeleteObjectRequest
        {
            BucketName = s3Settings.Value.BucketName,
            Key = $"meetup/{key}",
        };

        await s3Client.DeleteObjectAsync(request);
        return Result.Success();
    }

    public async Task<ICollection<FileDto>> ListFilesAsync(string prefix, List<string>? fileExtensions = null, CancellationToken cancellationToken = default)
    {
        var request = new ListObjectsV2Request
        {
            BucketName = s3Settings.Value.BucketName,
            Prefix = prefix,
        };
        var response = await s3Client.ListObjectsV2Async(request, cancellationToken);
        var result = response.S3Objects.Where(obj => !obj.Key.EndsWith('/'));
        if (fileExtensions != null)
        {
            result = result.Where(obj => fileExtensions.Contains(Path.GetExtension(obj.Key)));
        }
        
        return result
            .Select(o => new FileDto
            {
                Key = o.Key,
                FileName = Path.GetFileName(o.Key),
                CreatedAt = o.LastModified?.ToUniversalTime() ?? DateTime.UtcNow,
            })
            .OrderByDescending(o => o.CreatedAt)
            .ToList();
    }
}
