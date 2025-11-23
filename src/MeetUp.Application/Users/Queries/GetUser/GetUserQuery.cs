using MeetUp.Application.Mediator;

namespace MeetUp.Application.Users.Queries.GetUser;

public record GetUserQuery() : IQuery<UserDto>;