import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import { app } from 'electron';
import { initSnippetsTable } from './snippets.js';
import { initRegexTable } from './regex.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: Database.Database | null = null;

export async function getDb() {
  if (!db) {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'data.db');
    db = new Database(dbPath);
  }
  return db;
}

export async function initDatabase() {
  await initSnippetsTable();
  await initRegexTable();
  console.log('Database initialized successfully');
} 