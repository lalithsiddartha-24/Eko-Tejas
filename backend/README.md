# Eko Tejas API

The Express service preserves the `/api` route prefix used by the Vercel
multi-service routing in the repository's root `vercel.json`.

## Local setup

```powershell
cd backend
npm install
Copy-Item .env.example .env
# Fill in the Supabase values in .env
npm test
npm start
```

The server listens on `PORT` (default `5000`). Check it with:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Existing Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY` | Yes | Server-only database access for vehicle queries and active-admin checks |
| `SUPABASE_ANON_KEY` or `SUPABASE_PUBLISHABLE_KEY` | No | Used for Auth token verification when set; otherwise the server-only key is used |
| `SUPABASE_VEHICLE_PRESENTATION_TABLE` | No | Presentation table; defaults to `All vehicles` |
| `CORS_ALLOWED_ORIGINS` | No | Comma-separated exact HTTP(S) origins for cross-origin browser clients |
| `PORT` | No | Local listening port; defaults to `5000` |

Never put the service-role/secret key in frontend code or a `VITE_` variable.
The checked-in `.env.example` contains placeholders only; keep `.env` private.

## Routes

| Method | Path | Access |
| --- | --- | --- |
| GET | `/api/health` | Public |
| GET | `/api/vehicles` | Public |
| GET | `/api/vehicle-presentations/:vehicleName` | Public |
| POST | `/api/vehicles` | Active administrator |
| PUT | `/api/vehicles/:id` | Active administrator |
| DELETE | `/api/vehicles/:id` | Active administrator |

For administrator routes, sign in through Supabase Auth and send the returned
access token as `Authorization: Bearer <access-token>`. The API validates the
token with Supabase Auth, then checks the user's UUID against
`public.admin_users` with `is_active = true`.

## Vercel

The root `vercel.json` routes `/api/*` to the backend service rooted at
`backend/`. Configure the Supabase variables above in the backend service's
runtime environment settings for each deployment environment. The Express
application is exported from `server.js` for serverless handling; `app.listen`
is used only for local execution. No local filesystem persistence is used.
