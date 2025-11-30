using MeetUp.Application.Mediator;
using MeetUp.Application.Users.Queries.GetUser;

namespace MeetUp.Application.Users.Commands.Update;

public record UpdateUserCommand(string? FirstName, string? LastName, string? Email, string? AvatarUrl) : ICommand<UserDto>;