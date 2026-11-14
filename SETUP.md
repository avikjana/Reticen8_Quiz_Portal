# Setup

Requires **Node.js 22.9+**.

## 1. Install

```bash
npm run setup        # installs backend and frontend dependencies
```

## 2. Configure

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

In `backend/.env`, set `JWT_SECRET` to a long random string:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Without it the server makes up a new secret on every start, which logs everyone out each time it restarts.

### Google sign-in (optional)

1. Google Cloud Console -> APIs & Services -> Credentials -> Create credentials -> OAuth client ID -> **Web application**.
2. Under **Authorized JavaScript origins** add `http://localhost:5173` (and your live domain later).
3. Put the client ID in both `GOOGLE_CLIENT_ID` (`backend/.env`) and `VITE_GOOGLE_CLIENT_ID` (`frontend/.env.local`).

The Google button stays hidden until both are set.

## 3. Run

Use two terminals:

```bash
npm run dev:backend    # API on http://localhost:5000
npm run dev:frontend   # site on http://localhost:5173
```

The site needs the backend running: courses, certifications and login all come from the API.

## Other commands

```bash
npm run build    # production build of the frontend (frontend/dist)
npm run lint     # lint the frontend
```

## Deploying

- Set `NODE_ENV=production` and a real `JWT_SECRET` (the server refuses to start in production without one).
- Set `CLIENT_ORIGIN` in `backend/.env` to your site's address, and `VITE_API_URL` in the frontend to your API address.
- Change or remove the three seed accounts in `backend/src/data/users.json`.
- Set `TRUST_PROXY=true` only if the API runs behind a reverse proxy.
