namespace MeetUp.Application.Authentication;

public interface IUserContext
{
    Guid UserId { get; }
    
    string Email { get; }
}