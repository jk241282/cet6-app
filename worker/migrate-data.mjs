import initSqlJs from 'sql.js';
import fs from 'fs';

const dbBuffer = fs.readFileSync('../server/data/cet6.db');
const SQL = await initSqlJs();
const db = new SQL.Database(dbBuffer);

const tables = [
  'vocabulary', 'word_meanings', 'word_examples', 'word_phrases',
  'word_relations', 'reading_passages', 'reading_questions',
  'translation_exercises', 'writing_topics', 'writing_templates',
  'writing_sentences', 'listening_episodes', 'listening_questions',
  'exams', 'exam_results'
];

for (const table of tables) {
  const count = db.exec(`SELECT COUNT(*) FROM ${table}`);
  if (count.length > 0) {
    console.log(`-- Table: ${table} (${count[0].values[0][0]} rows)`);
  }

  const rows = db.exec(`SELECT * FROM ${table}`);
  if (rows.length === 0) continue;

  const columns = rows[0].columns;
  const values = rows[0].values;

  if (values.length === 0) continue;

  const insertSQLs = values.map(row => {
    const escaped = row.map((val, i) => {
      if (val === null) return 'NULL';
      if (typeof val === 'number') return String(val);
      const str = String(val).replace(/'/g, "''");
      return `'${str}'`;
    });
    return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${escaped.join(', ')});`;
  });

  // Write in batches to stdout
  const batchSize = 100;
  for (let i = 0; i < insertSQLs.length; i += batchSize) {
    const batch = insertSQLs.slice(i, i + batchSize);
    console.log(batch.join('\n'));
  }
}

db.close();
console.log('-- Done');
