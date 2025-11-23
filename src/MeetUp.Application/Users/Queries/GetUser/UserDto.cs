namespace MeetUp.Application.Users.Queries.GetUser;

public record UserDto(Guid Id, string Email, string FirstName, string LastName, string Role);