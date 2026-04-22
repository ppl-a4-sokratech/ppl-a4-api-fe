# ppl-a4-api-fe

Recipes Management Frontend — built with Next.js 16, TypeScript, and Tailwind CSS.

## Getting Started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type check |

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the Recipes Management API |

## CI/CD

- **CI** (`ci.yml`): runs on every PR and push to `main`/`develop` — lint, typecheck, build.
- **Deploy** (`deploy.yml`): runs on push to `main` — deploys to Vercel via CLI.

### Required GitHub Secrets / Variables

| Name | Where | Description |
|---|---|---|
| `VERCEL_TOKEN` | Secret | Vercel personal access token |
| `NEXT_PUBLIC_API_BASE_URL` | Variable (Actions) | API base URL for CI build |
