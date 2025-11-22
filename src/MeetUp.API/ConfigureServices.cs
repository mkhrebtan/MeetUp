namespace MeetUp.API;

public static class ConfigureServices
{
    public static IServiceCollection AddApiServices(this IServiceCollection services)
    {
        services.AddControllers();
        
        services.AddRouting(options =>
        {
            options.LowercaseUrls = true;
            options.LowercaseQueryStrings = true;
        });
        
        services.AddOpenApi();

        services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalhostFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:8080", "http://localhost:4200", "https://192.168.0.104:4200")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        
        return services;
    }
}