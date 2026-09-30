# Deployment Placeholders

Replace only the values that differ from the actual repositories and deployment resources. Keep the sample URLs when the deployed domains match. The two local env files are ignored by Git.

| Sample value | Location (file:line) | Replace with |
| --- | --- | --- |
| `QE170128` | `README.md:4`, `QE170128_SE19B.NET_Ass1_BE/README.md:3`, `QE170128_SE19B.NET_Ass1_FE/README.md:3`, `SUBMISSION.md:3`, `TASKS.md:4` | Actual student ID if this sample identity changes |
| `PRN232_SAMPLE` | `README.md:5`, `QE170128_SE19B.NET_Ass1_BE/README.md:4`, `QE170128_SE19B.NET_Ass1_FE/README.md:4`, `SUBMISSION.md:4`, `TASKS.md:5` | Actual class code; update the GitHub repository names and links accordingly |
| `https://github.com/truyendt/QE170128_PRN232_SAMPLE_Ass1_BE` | `README.md:8`, `QE170128_SE19B.NET_Ass1_BE/README.md:8`, `QE170128_SE19B.NET_Ass1_FE/README.md:8`, `SUBMISSION.md:9` | Actual backend GitHub repository URL |
| `https://github.com/truyendt/QE170128_PRN232_SAMPLE_Ass1_FE` | `README.md:9`, `QE170128_SE19B.NET_Ass1_BE/README.md:9`, `QE170128_SE19B.NET_Ass1_FE/README.md:9`, `SUBMISSION.md:10` | Actual frontend GitHub repository URL |
| `https://truyendt-tasktrack-api.onrender.com` | `README.md:10,135`, `QE170128_SE19B.NET_Ass1_BE/README.md:10,35`, `QE170128_SE19B.NET_Ass1_FE/README.md:10,30`, `QE170128_SE19B.NET_Ass1_FE/.env.local:1` | Actual Render service base URL, without a trailing slash or `/api` |
| `https://truyendt-tasktrack-api.onrender.com/swagger` | `README.md:11`, `QE170128_SE19B.NET_Ass1_BE/README.md:11,35`, `QE170128_SE19B.NET_Ass1_FE/README.md:11`, `SUBMISSION.md:11` | Actual Render Swagger UI URL |
| `https://my-assignment.vercel.app` | `README.md:12,129`, `QE170128_SE19B.NET_Ass1_BE/README.md:12,31,35`, `QE170128_SE19B.NET_Ass1_FE/README.md:12`, `SUBMISSION.md:12`, `.env.example:3`, `QE170128_SE19B.NET_Ass1_BE/.env.example:3`, `QE170128_SE19B.NET_Ass1_BE/TaskTrack.API/appsettings.json:13`, `QE170128_SE19B.NET_Ass1_BE/TaskTrack.API/appsettings.Example.json:13` | Actual Vercel origin, with no trailing slash; set Render `ALLOWED_ORIGINS` to this value |
| `https://your-backend.onrender.com` | `QE170128_SE19B.NET_Ass1_FE/.env.example:1`, `QE170128_SE19B.NET_Ass1_FE/README.md:26` | Actual backend base URL; the FE API client appends `/api` |
| `postgresql://user:password@host:5432/dbname` | `.env.example:1`, `QE170128_SE19B.NET_Ass1_BE/.env.example:1`, `QE170128_SE19B.NET_Ass1_BE/README.md:29` | Actual PostgreSQL URL in Render's `DATABASE_URL` setting, or a local database URL |
| `Host=localhost;Port=5432;Database=TaskManagementDB;Username=postgres;Password=change_me` | `QE170128_SE19B.NET_Ass1_BE/TaskTrack.API/appsettings.json:3`, `QE170128_SE19B.NET_Ass1_BE/TaskTrack.API/appsettings.Example.json:3` | Local-only fallback connection string; replace only if using appsettings instead of `DATABASE_URL` |
| `postgresql://tasktrack_user:change_me@dpg-sample-a.singapore-postgres.render.com:5432/tasktrack_db` | `QE170128_SE19B.NET_Ass1_BE/.env:1` | Local-only sample; replace with a real local database URL if needed. Do not commit real credentials. |
| `Production` | `.env.example:2`, `QE170128_SE19B.NET_Ass1_BE/.env.example:2`, `QE170128_SE19B.NET_Ass1_BE/README.md:30` | Keep `Production` on Render; use `Development` locally (`QE170128_SE19B.NET_Ass1_BE/.env:2`) |
| `ALLOWED_ORIGINS=https://my-assignment.vercel.app` | `.env.example:3`, `QE170128_SE19B.NET_Ass1_BE/.env.example:3` | Actual Vercel origin(s), comma-separated if there are multiple |
| `NEXT_PUBLIC_API_URL=https://truyendt-tasktrack-api.onrender.com` | `.env.example:4`, `QE170128_SE19B.NET_Ass1_FE/.env.local:1` | Actual Render backend base URL in Vercel settings and local FE env; omit `/api` |

`AllowedOrigins` in both backend appsettings files also contains the Vercel sample and `http://localhost:3000`; change the Vercel entry if it differs, and retain localhost for local development. Render's `ALLOWED_ORIGINS` environment variable overrides that list.