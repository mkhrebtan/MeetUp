namespace MeetUp.Infrastructure.Storage;

public sealed class S3Settings(string bucketName, string region)
{
    public const string SectionName = "S3Settings";

    public S3Settings()
        : this(string.Empty, string.Empty)
    {
    }

    public string BucketName { get; set; } = bucketName;

    public string Region { get; set; } = region;
    
    public string AccessKey { get; set; } = string.Empty;
    
    public string SecretKey { get; set; } = string.Empty;
}
