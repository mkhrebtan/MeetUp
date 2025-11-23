using MeetUp.Application.Authentication;
using MeetUp.Infrastructure.Authentication;
using MeetUp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace MeetUp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
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

        return services;
    }
}