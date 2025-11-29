using MeetUp.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetUp.API.Controllers;

public class StorageController : ApiControllerBase
{
    [HttpGet("file-upload-url")]
    [Authorize]
    public async Task<IResult> GetFileUploadUrl(string fileName, string contentType, IStorage storage, CancellationToken cancellationToken)
    {
        var url = await storage.GetFileUploadUrlAsync(fileName, contentType, cancellationToken);
        return Results.Ok(new { Url = url });
    }
}