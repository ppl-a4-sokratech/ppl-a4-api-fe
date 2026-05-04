# ppl-a4-api-fe

Sokratech Admin & Customer Portal — built with Next.js 16, TypeScript, and Tailwind CSS.

## Getting Started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | URL the browser uses to reach the API. Local dev: full URL (e.g. `http://localhost:3000`). Production on Vercel: set to `/api/proxy` to avoid mixed-content errors when BE is HTTP. |
| `API_BE_URL` | Production only | Actual BE URL used server-side by the `/api/proxy` route. Not needed for local dev. |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (port 3001) |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type check |

## CI/CD

- **CI** (`ci.yml`): runs on every PR and push to `main`/`develop` — lint, typecheck, build, SonarQube analysis.
- **Deploy** (`deploy.yml`): runs on push to `main` — deploys to Vercel via CLI.

### Required GitHub Secrets / Variables

| Name | Where | Description |
|---|---|---|
| `VERCEL_TOKEN` | Secret | Vercel personal access token |
| `NEXT_PUBLIC_API_BASE_URL` | Variable (Actions) | Set to `/api/proxy` for Vercel builds |
| `API_BE_URL` | Secret | Actual BE base URL, used by the proxy route |
