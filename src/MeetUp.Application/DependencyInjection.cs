using FluentValidation;
using MeetUp.Application.Behaviour;
using MeetUp.Application.Mediator;
using Microsoft.Extensions.DependencyInjection;

namespace MeetUp.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.Scan(scan => scan.FromAssembliesOf(typeof(DependencyInjection))
            .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<>)), false)
            .AsImplementedInterfaces()
            .WithScopedLifetime()
            .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<,>)), false)
            .AsImplementedInterfaces()
            .WithScopedLifetime()
            .AddClasses(classes => classes.AssignableTo(typeof(IQueryHandler<,>)), false)
            .AsImplementedInterfaces()
            .WithScopedLifetime());

        services.TryDecorate(typeof(ICommandHandler<>), typeof(ValidationDecorator.CommandBaseHandler<>));
        services.TryDecorate(typeof(ICommandHandler<,>), typeof(ValidationDecorator.CommandHandler<,>));

        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly, includeInternalTypes: true);

        return services;
    }
}