using MeetUp.Application.Mediator;

namespace MeetUp.Application.Users.Commands.Register;

public record RegisterUserCommand(string Email, string Password, string FirstName, string LastName) : ICommand;