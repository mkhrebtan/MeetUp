using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.API.Extensions;

internal static class ResultExtensions
{
    internal static IResult GetProblem(this Result result)
    {
        return Problem(result);
    }

    internal static IResult GetProblem<TResponse>(this Result<TResponse> result)
    {
        return Problem(result.ToStandardResult());
    }

    private static IResult Problem(Result result)
    {
        if (result.IsSuccess)
        {
            throw new InvalidOperationException();
        }

        return Results.Problem(
            title: GetTitle(result.Error),
            detail: GetDetail(result.Error),
            type: GetType(result.Error.ErrorType),
            statusCode: GetStatusCode(result.Error.ErrorType),
            extensions: GetErrors(result));

        static string GetTitle(Error error)
        {
            return error.ErrorType switch
            {
                ErrorType.Validation => error.Code,
                ErrorType.Problem => error.Code,
                ErrorType.NotFound => error.Code,
                ErrorType.Conflict => error.Code,
                _ => "Server failure",
            };
        }

        static string GetDetail(Error error)
        {
            return error.ErrorType switch
            {
                ErrorType.Validation => error.Message,
                ErrorType.Problem => error.Message,
                ErrorType.NotFound => error.Message,
                ErrorType.Conflict => error.Message,
                _ => "An unexpected error occurred",
            };
        }

        static string GetType(ErrorType errorType)
        {
            return errorType switch
            {
                ErrorType.Validation => "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                ErrorType.Problem => "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                ErrorType.NotFound => "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                ErrorType.Conflict => "https://tools.ietf.org/html/rfc7231#section-6.5.8",
                _ => "https://tools.ietf.org/html/rfc7231#section-6.6.1",
            };
        }

        static int GetStatusCode(ErrorType errorType)
        {
            return errorType switch
            {
                ErrorType.Validation or ErrorType.Problem => StatusCodes.Status400BadRequest,
                ErrorType.NotFound => StatusCodes.Status404NotFound,
                ErrorType.Conflict => StatusCodes.Status409Conflict,
                _ => StatusCodes.Status500InternalServerError,
            };
        }

        static Dictionary<string, object?>? GetErrors(Result result)
        {
            if (result.Error is not ValidationError validationError)
            {
                return null;
            }

            var errorsWithTypeNames = validationError.Errors.Select(error => new
            {
                error.Code,
                error.Message,
                ErrorType = error.ErrorType.ToString(),
            });

            return new Dictionary<string, object?>
            {
                { "errors", errorsWithTypeNames },
            };
        }
    }
}