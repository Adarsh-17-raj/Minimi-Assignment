import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { memoryStore, getAnchorDate } from './src/server/memory.js';
import { streamChatAgent, resolveTemporalExpressions } from './src/server/agent.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API Endpoints

  // 1. Get all sessions
  app.get('/api/sessions', (req, res) => {
    try {
      const sessions = memoryStore.listSessions();
      res.json({ sessions });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Create session
  app.post('/api/sessions', (req, res) => {
    try {
      const { title } = req.body || {};
      const session = memoryStore.createSession(title);
      res.json({ session });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Get single session
  app.get('/api/sessions/:id', (req, res) => {
    try {
      const session = memoryStore.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json({ session });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. Reset sessions to benchmark seeds
  app.post('/api/sessions/reset', (req, res) => {
    try {
      memoryStore.reset();
      res.json({ success: true, sessions: memoryStore.listSessions() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Temporal check helper endpoint (for UI preview / inspection)
  app.post('/api/temporal/resolve', (req, res) => {
    try {
      const { query, anchorDate } = req.body;
      const anchor = anchorDate ? new Date(anchorDate) : getAnchorDate();
      const resolution = resolveTemporalExpressions(query || '', anchor);
      res.json(resolution);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Benchmark scenarios list for testing
  app.get('/api/benchmarks', (req, res) => {
    res.json({
      anchorDate: getAnchorDate().toISOString(),
      anchorDateHuman: 'Wednesday, November 11, 2026',
      scenarios: [
        {
          id: 'crm',
          title: 'CRM Shortlist Changes',
          prompt: 'On Monday we shortlisted 5 CRM tools for a 20-person sales team. Has any of them changed pricing or shipped something big since?',
          baselineDate: 'Monday, Nov 9, 2026',
          sessionId: 'benchmark-crm'
        },
        {
          id: 'nov3',
          title: '3 November Question Recall & Check',
          prompt: 'What did I ask you on 3 November? Is your answer still correct today?',
          baselineDate: 'Tuesday, Nov 3, 2026',
          sessionId: 'benchmark-postgres'
        },
        {
          id: 'postgres',
          title: 'Postgres Hosting Pricing Changes',
          prompt: 'Last Tuesday I asked you about Postgres hosting. Has any pricing changed since then?',
          baselineDate: 'Tuesday, Nov 3, 2026 (Last Tuesday)',
          sessionId: 'benchmark-postgres'
        }
      ]
    });
  });

  // 7. Core SSE chat streaming route
  app.post('/api/chat', async (req, res) => {
    const { sessionId, message, anchorDate } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    let activeSessionId = sessionId;
    if (!activeSessionId) {
      const newSession = memoryStore.createSession();
      activeSessionId = newSession.id;
    }

    await streamChatAgent(activeSessionId, message, res, anchorDate);
  });

  // Mount Vite or static build
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Minimi Search Agent server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
