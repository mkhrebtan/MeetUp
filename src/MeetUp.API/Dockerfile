FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/MeetUp.API/MeetUp.API.csproj", "src/MeetUp.API/"]
COPY ["src/MeetUp.Application/MeetUp.Application.csproj", "src/MeetUp.Application/"]
COPY ["src/MeetUp.Infrastructure/MeetUp.Infrastructure.csproj", "src/MeetUp.Infrastructure/"]
COPY ["src/MeetUp.Domain/MeetUp.Domain.csproj", "src/MeetUp.Domain/"]
RUN dotnet restore "src/MeetUp.API/MeetUp.API.csproj"
COPY . .
WORKDIR "/src/src/MeetUp.API"
RUN dotnet build "MeetUp.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "MeetUp.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MeetUp.API.dll"]
