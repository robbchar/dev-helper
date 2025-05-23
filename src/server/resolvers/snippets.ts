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

function transformSnippetToDB(snippet: CreateSnippetInput): SnippetDB {
  return {
    id: '', // This will be set by the caller
    title: snippet.title,
    description: snippet.description || null,
    code: snippet.code,
    language: snippet.language,
    tags: snippet.tags ? JSON.stringify(snippet.tags) : null,
    created_at: '', // This will be set by the caller
    updated_at: '' // This will be set by the caller
  };
}

export const snippetsResolvers = {
  Query: {
    async snippets() {
      const db = await getDb();
      const snippets = db.prepare('SELECT * FROM snippets ORDER BY created_at DESC').all() as SnippetDB[];
      return snippets.map(transformDBToSnippet);
    },

    async snippet(_parent: unknown, { id }: { id: string }): Promise<Snippet | null> {
      const db = await getDb();
      const snippet = db.prepare('SELECT * FROM snippets WHERE id = ?').get(id) as SnippetDB | undefined;
      if (!snippet) return null;
      return transformDBToSnippet(snippet);
    },

    async searchSnippets(_parent: unknown, { query, tags }: { query: string; tags?: string[] }) {
      const db = await getDb();
      let sql = 'SELECT * FROM snippets WHERE 1=1';
      const params: any[] = [];

      // Search in title and description
      if (query) {
        sql += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${query}%`, `%${query}%`);
      }

      // Filter by tags if provided
      if (tags && tags.length > 0) {
        const tagConditions = tags.map(() => 'json_array_length(tags) > 0 AND json_array_contains(tags, ?)');
        sql += ` AND (${tagConditions.join(' OR ')})`;
        params.push(...tags);
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
      const existingSnippet = db.prepare('SELECT * FROM snippets WHERE id = ?').get(id) as SnippetDB;
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
      
      // Start with existing data and merge updates
      const updates = {
        title: input.title ?? existingSnippet.title,
        description: input.description ?? existingSnippet.description,
        code: input.code ?? existingSnippet.code,
        language: input.language ?? existingSnippet.language,
        tags: input.tags ? JSON.stringify(input.tags) : existingSnippet.tags,
        updated_at: now
      };

      const sql = `
        UPDATE snippets 
        SET title = ?, description = ?, code = ?, language = ?, tags = ?, updated_at = ?
        WHERE id = ?
      `;

      db.prepare(sql).run(
        updates.title,
        updates.description,
        updates.code,
        updates.language,
        updates.tags,
        updates.updated_at,
        id
      );

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