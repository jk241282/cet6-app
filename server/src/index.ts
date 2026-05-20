import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db/index.js';
import authRoutes from './routes/auth.js';
import vocabularyRoutes from './routes/vocabulary.js';
import readingRoutes from './routes/reading.js';
import translationRoutes from './routes/translation.js';
import writingRoutes from './routes/writing.js';

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/reading', readingRoutes);
app.use('/api/translation', translationRoutes);
app.use('/api/writing', writingRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
