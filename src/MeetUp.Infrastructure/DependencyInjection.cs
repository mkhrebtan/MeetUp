using Amazon.S3;
using MeetUp.Application.Authentication;
using MeetUp.Application.Common.Interfaces;
using MeetUp.Infrastructure.Authentication;
using MeetUp.Infrastructure.Common;
using MeetUp.Infrastructure.Persistence;
using MeetUp.Infrastructure.Rooms;
using MeetUp.Infrastructure.Storage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace MeetUp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.Audience = configuration["AUTHENTICATION_AUDIENCE"];
                options.MetadataAddress = configuration["AUTHENTICATION_METADATA_ADDRESS"]!;
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = configuration["AUTHENTICATION_ISSUER"],
                    RoleClaimType = "role",
                };
            });

        services.AddAuthorization();

        services.AddHttpContextAccessor();
        services.AddScoped<IUserContext, UserContext>();

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration["CONNECTION_STRING"]));

        services.AddScoped<IApplicationDbContext, ApplicationDbContext>();

        services.Configure<KeycloakSettings>(configuration.GetSection("Keycloak"));
        services.AddScoped<IIdentityProvider, KeycloakIdentityProvider>();

        services.AddHttpClient();

        services.AddSingleton<IInviteCodeGenerator, InviteCodeGenerator>();
        
        services.AddTransient(typeof(IPagedList<>), typeof(PagedList<>));
        
        services.Configure<S3Settings>(configuration.GetSection("AWS"));
        services.AddDefaultAWSOptions(configuration.GetAWSOptions());
        services.AddAWSService<IAmazonS3>();
        services.AddScoped<IStorage, S3Storage>();

        services.Configure<LiveKitSettings>(configuration.GetSection("LIVEKIT"));
        services.AddScoped<IRoomService, LiveKitService>();
            
        return services;
    }
}