import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import { initSnippetsTable } from './snippets.js';
import { initRegexTable } from './regex.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: Database.Database | null = null;

export async function getDb() {
  if (!db) {
    db = new Database(path.join(__dirname, '../../../data.db'));
  }
  return db;
}

export async function initDatabase() {
  await initSnippetsTable();
  await initRegexTable();
  console.log('Database initialized successfully');
} 