import { getDb } from './index.js';

export async function initRegexTable() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS regex_patterns (
      id TEXT PRIMARY KEY,
      pattern TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      flags TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
} 