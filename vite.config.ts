import 'dotenv/config';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { analyzeMiddleware } from './server/analyze';

// Mounts the live AI scam-check endpoint during `vite dev` and `vite preview`,
// so the app is fully functional with a single `npm run dev` (no separate server).
function scamApiPlugin(): Plugin {
  const handler = analyzeMiddleware();
  return {
    name: 'scam-protect-api',
    configureServer(server) {
      server.middlewares.use('/api/analyze', handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/analyze', handler);
    },
  };
}

export default defineConfig({
  plugins: [react(), scamApiPlugin()],
  server: { port: 5173 },
  preview: { port: 4173 },
});
