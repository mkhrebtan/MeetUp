using MeetUp.API.Exceptions;

namespace MeetUp.API;

public static class ConfigureServices
{
    public static IServiceCollection AddApiServices(this IServiceCollection services)
    {
        services.AddControllers();
        services.AddHttpLogging();
        services.AddExceptionHandler<GlobalExceptionHandler>();
        
        services.AddOpenApi();
        services.AddRouting(options =>
        {
            options.LowercaseUrls = true;
            options.LowercaseQueryStrings = true;
        });

        services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalhostFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:8080", "http://localhost:4200", "https://meetup.client:4200")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        
        return services;
    }
}