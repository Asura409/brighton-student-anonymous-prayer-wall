import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = process.env.PORT || 4000;
const app = express();
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined, max: 5 });
app.use(cors());
app.use(express.json({ limit: '20kb' }));
app.get('/health', (_req, res) => res.json({ ok: true }));

const starter = [
  { id: 1, category: 'campus', text: 'Please pray for everyone finding their feet this semester — that we find good people and feel at home here.', time: 'Today' },
  { id: 2, category: 'personal', text: 'For courage to make a decision I have been putting off, and peace with whatever comes next.', time: 'Today' },
  { id: 3, category: 'community', text: 'For our city and everyone sleeping rough tonight. May they find warmth, safety, and kindness.', time: 'Yesterday' }
];

async function getPublishedPrayers() {
  try {
    const { rows } = await pool.query("SELECT id, category, body AS text, created_at FROM prayers WHERE status = 'published' ORDER BY created_at DESC");
    return rows.map(row => ({ ...row, time: new Date(row.created_at).toLocaleDateString() }));
  } catch { return starter; }
}

app.get('/api/prayers', async (_req, res) => res.json(await getPublishedPrayers()));
app.post('/api/prayers', async (req, res) => {
  const { category = 'personal', body } = req.body;
  if (!body || body.trim().length < 3 || body.length > 500 || !['campus', 'personal', 'community'].includes(category)) return res.status(400).json({ error: 'Please provide a valid prayer.' });
  try { const { rows } = await pool.query('INSERT INTO prayers (category, body, status) VALUES ($1, $2, $3) RETURNING id', [category, body.trim(), 'pending']); res.status(201).json({ id: rows[0].id, message: 'Prayer submitted for moderation.' }); }
  catch { res.status(500).json({ error: 'Unable to save prayer' }); }
});
async function start() {
  const isProduction = process.env.NODE_ENV === 'production';
  let render;
  let template;
  if (isProduction) {
    template = await fs.readFile(path.join(root, 'dist/index.html'), 'utf8');
    ({ render } = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href));
    app.use(express.static(path.join(root, 'dist')));
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });
    app.use(vite.middlewares);
    template = await fs.readFile(path.join(root, 'index.html'), 'utf8');
    app.get('*', async (req, res, next) => {
      try { const { render: devRender } = await vite.ssrLoadModule('/src/entry-server.jsx'); const data = { posts: await getPublishedPrayers() }; const html = await vite.transformIndexHtml(req.originalUrl, template); const initial = JSON.stringify(data).replace(/</g, '\\u003c'); res.end(html.replace('<!--ssr-outlet-->', devRender(data)).replace('</body>', `<script>window.__INITIAL_DATA__=${initial}</script></body>`)); }
      catch (error) { vite.ssrFixStacktrace(error); next(error); }
    });
  }
  if (isProduction) app.get('*', async (_req, res, next) => { try { const data = { posts: await getPublishedPrayers() }; const initial = JSON.stringify(data).replace(/</g, '\\u003c'); res.end(template.replace('<!--ssr-outlet-->', render(data)).replace('</body>', `<script>window.__INITIAL_DATA__=${initial}</script></body>`)); } catch (error) { next(error); } });
  app.listen(port, () => console.log(`SSR prayer wall listening on http://localhost:${port}`));
}
start();
