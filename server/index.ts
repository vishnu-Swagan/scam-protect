import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { analyzeMiddleware } from './analyze';

// Production server: serves the built client (dist/) and the live AI endpoint.
// Dev/preview do not use this — Vite mounts the same handler via a plugin.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, '../dist');
const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.post('/api/analyze', analyzeMiddleware());

app.use(express.static(dist));

// SPA fallback — let the client router handle everything else.
app.get('*', (_req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SecurityZ — Scam Protect running at http://localhost:${PORT}`);
});
