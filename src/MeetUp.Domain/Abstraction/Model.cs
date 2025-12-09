namespace MeetUp.Domain.Abstraction;

public abstract class Model
{
    public Guid Id { get; set; } = Guid.NewGuid();
}