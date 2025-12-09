using MeetUp.Application.Authentication;
using Microsoft.AspNetCore.Http;

namespace MeetUp.Infrastructure.Authentication;

public class UserContext(IHttpContextAccessor httpContextAccessor) : IUserContext
{
    public Guid UserId => httpContextAccessor.HttpContext?.User.GetUserId() ?? throw new ApplicationException("User context is unavailable");
    
    public string Email => httpContextAccessor.HttpContext?.User.GetUserEmail() ?? throw new ApplicationException("User context is unavailable");
}