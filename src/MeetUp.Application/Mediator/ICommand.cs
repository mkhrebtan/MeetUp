namespace MeetUp.Application.Mediator;

public interface ICommand : IBaseCommand
{
}

public interface ICommand<TResponse> : IBaseCommand
{
}

public interface IBaseCommand
{
}