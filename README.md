# QA360 - Smart QA Monitoring Tool

QA360 includes:
- `dashboard`: React frontend (deploy to Vercel)
- `backend`: Express API (deploy to Railway)

## Local Run

### 1) Backend
```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:8080`.

### 2) Dashboard
```bash
cd dashboard
npm install
```

Create `dashboard/.env`:
```env
REACT_APP_API_URL=http://localhost:8080
```

Then run:
```bash
npm start
```

Dashboard runs on `http://localhost:3000`.

## Deploy

### Vercel (Frontend)
1. Import this repo in Vercel.
2. Set Root Directory to `dashboard`.
3. Framework preset: Create React App.
4. Build command: `npm run build`
5. Output directory: `build`
6. Add env var:
   - `REACT_APP_API_URL=<your-railway-backend-url>`

### Railway (Backend)
1. Create a new Railway project from this repo.
2. Railway uses `railway.toml` in repo root and deploys from `backend`.
3. Service start command is `npm start`.
4. Confirm health check endpoint: `/health`.

## Notes
- After Railway deploys, copy its public URL and set it as `REACT_APP_API_URL` in Vercel.
- Redeploy Vercel after updating environment variables.

## GitHub Actions Auto Deploy

This repo includes `.github/workflows/deploy.yml` to auto deploy on pushes to `main`.

Add these repository secrets in GitHub:
- `RAILWAY_TOKEN`
- `RAILWAY_SERVICE_NAME`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

What the workflow does:
1. Deploys backend to Railway.
2. Builds and deploys dashboard to Vercel (production).
