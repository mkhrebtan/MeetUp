using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Domain.Authentication;

public static class AuthenticationErrors
{
    public static readonly Error DuplicateEmail = Error.Conflict(
        "Authentication.DuplicateEmail",
        "The email is already in use.");
}