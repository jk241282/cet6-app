const initSqlJs = require('../server/node_modules/sql.js/dist/sql-wasm.js');
const fs = require('fs');

(async () => {
  const SQL = await initSqlJs();
  const buf = fs.readFileSync('../server/data/cet6.db');
  const db = new SQL.Database(buf);

  const tables = [
    'vocabulary', 'word_meanings', 'word_examples', 'word_phrases',
    'word_relations', 'reading_passages', 'reading_questions',
    'translation_exercises', 'writing_topics', 'writing_templates',
    'writing_sentences', 'listening_episodes', 'listening_questions',
    'exams', 'exam_results'
  ];

  const outFile = fs.createWriteStream('../d1-import.sql');

  for (const table of tables) {
    const rows = db.exec(`SELECT * FROM ${table}`);
    if (rows.length === 0) continue;

    const columns = rows[0].columns;
    const values = rows[0].values;

    if (values.length === 0) continue;

    console.error(`Exporting ${table}: ${values.length} rows`);

    for (const row of values) {
      const escaped = row.map((val) => {
        if (val === null) return 'NULL';
        if (typeof val === 'number') return String(val);
        const str = String(val).replace(/'/g, "''");
        return `'${str}'`;
      });
      outFile.write(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${escaped.join(', ')});\n`);
    }
  }

  outFile.end();
  db.close();
  console.error('Done! Output: d1-import.sql');
})();
