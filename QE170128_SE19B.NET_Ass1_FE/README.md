# TaskTrack Frontend

**Student ID:** QE170128  
**Class Code:** PRN232_SAMPLE

## Project Links

- **Backend GitHub:** https://github.com/truyendt/QE170128_PRN232_SAMPLE_Ass1_BE
- **Frontend GitHub:** https://github.com/truyendt/QE170128_PRN232_SAMPLE_Ass1_FE
- **Render API:** https://truyendt-tasktrack-api.onrender.com
- **Swagger:** https://truyendt-tasktrack-api.onrender.com/swagger
- **Vercel:** https://my-assignment.vercel.app

## Local Development

```powershell
Copy-Item .env.example .env.local
npm ci
npm run dev
```

Open http://localhost:3000. `NEXT_PUBLIC_API_URL` is the backend base URL; the API client adds `/api` automatically. Set the value before building or starting the frontend.

| Variable | Sample | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com` | Backend base URL, without `/api` |

## Production

Deploy this directory as the Vercel project root and set `NEXT_PUBLIC_API_URL` to `https://truyendt-tasktrack-api.onrender.com` in the Vercel project environment settings.
