# TaskTrack Backend

**Student ID:** QE170128  
**Class Code:** PRN232_SAMPLE

## Project Links

- **Backend GitHub:** https://github.com/truyendt/QE170128_PRN232_SAMPLE_Ass1_BE
- **Frontend GitHub:** https://github.com/truyendt/QE170128_PRN232_SAMPLE_Ass1_FE
- **Render API:** https://truyendt-tasktrack-api.onrender.com
- **Swagger:** https://truyendt-tasktrack-api.onrender.com/swagger
- **Vercel:** https://my-assignment.vercel.app

## Local Development

Requires the .NET 8 SDK and PostgreSQL. Create a local database using the root `TaskManagementDB_Postgres (1).sql` script, then configure the environment and run:

```powershell
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/tasktrack_db"
$env:ASPNETCORE_ENVIRONMENT = "Development"
dotnet restore QE170128_SE19B.NET_Ass1_BE.sln
dotnet run --project TaskTrack.API
```

Swagger is available at http://localhost:5066/swagger. ASP.NET Core does not load `.env` files by default; export the variables in the shell as above or use another local environment-variable loader. `.env` is provided as a reference only.

| Variable | Sample | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://user:password@host:5432/dbname` | PostgreSQL connection URL; Render URLs are converted to Npgsql connection strings |
| `ASPNETCORE_ENVIRONMENT` | `Production` | ASP.NET Core environment |
| `ALLOWED_ORIGINS` | `https://my-assignment.vercel.app` | Comma-separated CORS origin list; appsettings also includes localhost for development |

## Render Deployment

Deploy this directory with its Dockerfile. Set `DATABASE_URL`, `ASPNETCORE_ENVIRONMENT=Production`, and `ALLOWED_ORIGINS=https://my-assignment.vercel.app` in the Render service environment. The service binds to Render's `PORT` and exposes Swagger at https://truyendt-tasktrack-api.onrender.com/swagger.