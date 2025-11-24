using Amazon.S3;
using Amazon.S3.Model;
using MeetUp.Application.Common.Interfaces;
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
}
