import { app } from 'electron';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { initSnippetsTable } from './snippets.js';
import { initRegexTable } from './regex.js';

// Use a local path for testing, app.getPath for production
const dbPath = process.env.NODE_ENV === 'test' 
  ? path.join(process.cwd(), 'test.db')
  : path.join(process.cwd(), 'dev-helper.db');

export const db = await open({
  filename: dbPath,
  driver: sqlite3.Database
});

export async function initDatabase() {
  await initSnippetsTable();
  await initRegexTable();
  console.log('Database initialized successfully');
} 