# Brighton Student Society — Anonymous Prayer Wall

A calm, anonymous space for Brighton students to share prayer requests. The frontend is React/Vite and the API is Express with Supabase PostgreSQL storage.

## Run locally

Install dependencies and start the SSR app:

```bash
npm install
npm run dev
```

Express and Vite render the initial page on the server, then React hydrates it in the browser. For a production build, run `npm run build`, set `NODE_ENV=production`, and start with `npm run server`.

For Supabase-backed storage, copy `.env.example` to `.env`, set `DATABASE_URL`, run `npm run migrate`, then run the server. Without a reachable database, the SSR app uses starter prayers and the browser keeps its local fallback. A production version should also add server-side moderation, rate limiting, and abuse protection.

## Deploy on Render

The included `render.yaml` creates a Node web service. Connect the repository to Render, create the service from the Blueprint, and enter the `DATABASE_URL` value in the Render dashboard. The database must be a reachable Supabase PostgreSQL database; do not commit `.env` or real credentials.
