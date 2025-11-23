using MeetUp.Domain.Shared.ErrorHandling;

namespace MeetUp.Application.Mediator;

public interface ICommandHandler<in TCommand>
    where TCommand : ICommand
{
    Task<Result> Handle(TCommand request, CancellationToken cancellationToken = default);
}

public interface ICommandHandler<in TCommand, TResponse>
    where TCommand : ICommand<TResponse>
{
    Task<Result<TResponse>> Handle(TCommand command, CancellationToken cancellationToken = default);
}