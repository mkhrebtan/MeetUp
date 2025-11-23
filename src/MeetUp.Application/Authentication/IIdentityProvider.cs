using MeetUp.Domain.Models;

namespace MeetUp.Application.Authentication;

public interface IIdentityProvider
{
    Task CreateAsync(User user, string password, CancellationToken cancellationToken = default);
}