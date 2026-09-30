FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and csproj files first for optimal layer caching
COPY ["QE170128_SE19B.NET_Ass1_BE/QE170128_SE19B.NET_Ass1_BE.sln", "QE170128_SE19B.NET_Ass1_BE/"]
COPY ["QE170128_SE19B.NET_Ass1_BE/TaskTrack.API/TaskTrack.API.csproj", "QE170128_SE19B.NET_Ass1_BE/TaskTrack.API/"]
COPY ["QE170128_SE19B.NET_Ass1_BE/TaskTrack.Repo/TaskTrack.Repo.csproj", "QE170128_SE19B.NET_Ass1_BE/TaskTrack.Repo/"]
COPY ["QE170128_SE19B.NET_Ass1_BE/TaskTrack.Service/TaskTrack.Service.csproj", "QE170128_SE19B.NET_Ass1_BE/TaskTrack.Service/"]

RUN dotnet restore "QE170128_SE19B.NET_Ass1_BE/QE170128_SE19B.NET_Ass1_BE.sln"

# Copy the entire backend source code
COPY QE170128_SE19B.NET_Ass1_BE/ QE170128_SE19B.NET_Ass1_BE/
WORKDIR "/src/QE170128_SE19B.NET_Ass1_BE/TaskTrack.API"
RUN dotnet publish "TaskTrack.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "TaskTrack.API.dll"]
