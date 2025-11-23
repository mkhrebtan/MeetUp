namespace MeetUp.Domain.Abstraction;

public abstract class Model
{
    public Guid Id { get; protected set; } = Guid.NewGuid();
}