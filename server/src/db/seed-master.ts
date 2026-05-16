// 主种子脚本 - 一次性运行所有数据录入
import { initDb, getDb, saveDb } from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('=== CET-6 Master Seed Starting ===');

// Initialize fresh
await initDb();
const db = getDb();
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.run(schema);
console.log('Schema loaded.');

// Load all seed data scripts via dynamic import
const seedFiles = [
  'seed-vocabulary.ts',
  'seed-vocabulary-batch2.ts',
  'seed-vocabulary-batch3.ts',
  'seed-vocabulary-batch4.ts',
  'seed-vocabulary-massive.ts',
  'seed-vocabulary-ez.ts',
  'seed-vocabulary-jz.ts',
  'seed-vocabulary-qz.ts',
  'seed-vocabulary-uz.ts',
  'seed-content.ts',
  'seed-reading-full.ts',
  'seed-translation-full.ts',
];

for (const file of seedFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP ${file} (not found)`);
    continue;
  }
  console.log(`  Running ${file}...`);
  try {
    // Each seed file uses its own initDatabase() which calls initDb() again
    // This is OK as long as initDatabase doesn't save empty state
    await import(filePath);
  } catch (e) {
    console.error(`  ERROR in ${file}:`, e);
  }
}

// Force final save
saveDb();

// Verify
const r = db.exec('SELECT COUNT(*) as c FROM vocabulary');
console.log(`\n=== Master Seed Complete ===`);
console.log(`Vocabulary: ${r[0].values[0][0]} words`);
const r2 = db.exec('SELECT COUNT(*) as c FROM reading_passages');
console.log(`Reading: ${r2[0].values[0][0]} passages`);
const r3 = db.exec('SELECT COUNT(*) as c FROM translation_exercises');
console.log(`Translation: ${r3[0].values[0][0]} exercises`);
const r4 = db.exec('SELECT COUNT(DISTINCT word_id) as c FROM word_examples');
console.log(`Words with examples: ${r4[0].values[0][0]}`);
