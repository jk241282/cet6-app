import initSqlJs, { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '..', 'data', 'cet6.db');

let SQL: SqlJsStatic | null = null;
let db: SqlJsDatabase | null = null;

export async function initDb(): Promise<void> {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');
}

export function getDb(): SqlJsDatabase {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}

export function saveDb(): void {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// Helpers that wrap sql.js to provide a better-sqlite3-like API
export function queryAll<T = Record<string, unknown>>(sql: string, params: (string | number | null)[] = []): T[] {
  const database = getDb();
  const stmt = database.prepare(sql);
  stmt.bind(params);
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

export function queryOne<T = Record<string, unknown>>(sql: string, params: (string | number | null)[] = []): T | undefined {
  const database = getDb();
  const stmt = database.prepare(sql);
  stmt.bind(params);
  let result: T | undefined;
  if (stmt.step()) {
    result = stmt.getAsObject() as T;
  }
  stmt.free();
  return result;
}

export function execute(sql: string, params: (string | number | null)[] = []): { changes: number; lastInsertRowid: number } {
  const database = getDb();
  database.run(sql, params);
  const lastId = database.exec('SELECT last_insert_rowid() as id');
  const lastInsertRowid = lastId.length > 0 ? (lastId[0].values[0][0] as number) : 0;
  const changes = database.getRowsModified();
  saveDb();
  return { changes, lastInsertRowid };
}
