import { initDb, getDb, saveDb } from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function initDatabase(): Promise<void> {
  await initDb();
  const db = getDb();
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.run(schema);
  saveDb();
  console.log('Database initialized successfully');
}

initDatabase().catch(err => { console.error(err); process.exit(1); });
