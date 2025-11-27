using MeetUp.Domain.Models;
using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Authentication;

public interface IIdentityProvider
{
    Task<Result> CreateAsync(User user, string password, CancellationToken cancellationToken = default);

    Task<Result> UpdateRole(User user, CancellationToken cancellationToken = default);
}