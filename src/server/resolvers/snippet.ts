import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/index.js';
import type { Snippet, CreateSnippetInput, UpdateSnippetInput } from '../../renderer/types/Snippet';

interface SnippetDB {
  id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

function transformDBToSnippet(dbSnippet: SnippetDB): Snippet {
  return {
    id: dbSnippet.id,
    title: dbSnippet.title,
    description: dbSnippet.description || undefined,
    code: dbSnippet.code,
    language: dbSnippet.language,
    tags: dbSnippet.tags ? JSON.parse(dbSnippet.tags) : [],
    created_at: dbSnippet.created_at,
    updated_at: dbSnippet.updated_at
  };
}

function transformSnippetToDB(snippet: CreateSnippetInput | UpdateSnippetInput): Partial<SnippetDB> {
  return {
    title: snippet.title,
    description: snippet.description || null,
    code: snippet.code,
    language: snippet.language,
    tags: snippet.tags ? JSON.stringify(snippet.tags) : null
  };
}

export const snippetResolvers = {
  Query: {
    async snippets() {
      const db = await getDb();
      const snippets = db.prepare('SELECT * FROM snippets ORDER BY created_at DESC').all() as SnippetDB[];
      return snippets.map(transformDBToSnippet);
    },

    async snippet(_parent: unknown, { id }: { id: string }) {
      const db = await getDb();
      const snippet = db.prepare('SELECT * FROM snippets WHERE id = ?').get(id) as SnippetDB;
      return snippet ? transformDBToSnippet(snippet) : null;
    },

    async searchSnippets(_parent: unknown, { query, tags }: { query: string; tags?: string[] }) {
      const db = await getDb();
      let sql = 'SELECT * FROM snippets WHERE title LIKE ? OR description LIKE ?';
      const params = [`%${query}%`, `%${query}%`];

      if (tags && tags.length > 0) {
        sql += ' AND (';
        const tagConditions = tags.map((tag, index) => {
          params.push(`%${tag}%`);
          return `tags LIKE ?`;
        });
        sql += tagConditions.join(' OR ') + ')';
      }

      sql += ' ORDER BY created_at DESC';
      const snippets = db.prepare(sql).all(...params) as SnippetDB[];
      return snippets.map(transformDBToSnippet);
    }
  },

  Mutation: {
    async createSnippet(_parent: unknown, { input }: { input: CreateSnippetInput }) {
      const db = await getDb();

      // Check if a snippet with this title already exists
      const existingSnippet = db.prepare('SELECT id FROM snippets WHERE title = ?').get(input.title);
      if (existingSnippet) {
        throw new Error(`A snippet with the title "${input.title}" already exists`);
      }

      const id = uuidv4();
      const now = new Date().toISOString();
      const snippetData = transformSnippetToDB(input);
      
      db.prepare(
        `INSERT INTO snippets (id, title, description, code, language, tags, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        id,
        snippetData.title,
        snippetData.description,
        snippetData.code,
        snippetData.language,
        snippetData.tags,
        now,
        now
      );

      const snippet = db.prepare('SELECT * FROM snippets WHERE id = ?').get(id) as SnippetDB;
      return transformDBToSnippet(snippet);
    },

    async updateSnippet(_parent: unknown, { id, input }: { id: string; input: UpdateSnippetInput }) {
      const db = await getDb();

      // Check if snippet exists
      const existingSnippet = db.prepare('SELECT id FROM snippets WHERE id = ?').get(id);
      if (!existingSnippet) {
        throw new Error(`Snippet with ID "${id}" not found`);
      }

      // Check if new title conflicts with existing snippet
      if (input.title) {
        const titleConflict = db.prepare('SELECT id FROM snippets WHERE title = ? AND id != ?').get(input.title, id);
        if (titleConflict) {
          throw new Error(`A snippet with the title "${input.title}" already exists`);
        }
      }

      const now = new Date().toISOString();
      const snippetData = transformSnippetToDB(input);
      
      const updates: string[] = [];
      const params: any[] = [];

      if (snippetData.title !== undefined) {
        updates.push('title = ?');
        params.push(snippetData.title);
      }
      if (snippetData.description !== undefined) {
        updates.push('description = ?');
        params.push(snippetData.description);
      }
      if (snippetData.code !== undefined) {
        updates.push('code = ?');
        params.push(snippetData.code);
      }
      if (snippetData.language !== undefined) {
        updates.push('language = ?');
        params.push(snippetData.language);
      }
      if (snippetData.tags !== undefined) {
        updates.push('tags = ?');
        params.push(snippetData.tags);
      }

      updates.push('updated_at = ?');
      params.push(now);
      params.push(id);

      const sql = `UPDATE snippets SET ${updates.join(', ')} WHERE id = ?`;
      db.prepare(sql).run(...params);

      const snippet = db.prepare('SELECT * FROM snippets WHERE id = ?').get(id) as SnippetDB;
      return transformDBToSnippet(snippet);
    },

    async deleteSnippet(_parent: unknown, { id }: { id: string }): Promise<boolean> {
      const db = await getDb();
      const result = db.prepare('DELETE FROM snippets WHERE id = ?').run(id);
      return result.changes > 0;
    }
  }
}; 