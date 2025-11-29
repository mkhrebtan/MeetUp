using MeetUp.Application.Mediator;

namespace MeetUp.Application.Users.Commands.Update;

public record UpdateUserCommand(string? FirstName, string? LastName, string? Email, string? AvatarUrl) : ICommand;