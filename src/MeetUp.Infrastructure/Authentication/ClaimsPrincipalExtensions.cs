using System.Security.Claims;

namespace MeetUp.Infrastructure.Authentication;

internal static class ClaimsPrincipalExtensions
{
    extension(ClaimsPrincipal? principal)
    {
        public Guid GetUserId()
        {
            var userId = principal?.FindFirstValue("sub");

            return Guid.TryParse(userId, out var parsedUserId) ? parsedUserId : throw new ApplicationException("User id is unavailable");
        }

        public string GetUserEmail()
        {
            var email = principal?.FindFirstValue("email");
            return email ?? throw new ApplicationException("User email is unavailable");
        }
    }
}