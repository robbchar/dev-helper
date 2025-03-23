import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/index.js';

interface SnippetDB {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const snippetsResolvers = {
  Query: {
    async snippets() {
      const db = await getDb();
      const snippets = db.prepare('SELECT * FROM snippets').all() as SnippetDB[];
      return snippets.map(snippet => ({
        ...snippet,
        tags: snippet.tags ? JSON.parse(snippet.tags) : []
      }));
    },
    snippet: async (_parent: unknown, { id }: { id: string }): Promise<Snippet | null> => {
      const db = await getDb();
      const snippet = db.prepare('SELECT * FROM snippets WHERE id = ?').get(id) as SnippetDB | undefined;
      if (!snippet) return null;
      return {
        ...snippet,
        tags: snippet.tags ? JSON.parse(snippet.tags) : []
      };
    }
  },
  Mutation: {
    async createSnippet(_parent: unknown, { input }: { input: Omit<Snippet, 'id' | 'created_at' | 'updated_at'> }) {
      const db = await getDb();
      const id = uuidv4();
      const tags = input.tags ? JSON.stringify(input.tags) : null;
      
      db.prepare(
        `INSERT INTO snippets (id, title, code, language, description, tags)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(id, input.title, input.code, input.language, input.description, tags);

      const snippet = db.prepare('SELECT * FROM snippets WHERE id = ?').get(id) as SnippetDB;
      return {
        ...snippet,
        tags: snippet.tags ? JSON.parse(snippet.tags) : []
      };
    },
    updateSnippet: async (_parent: unknown, { id, ...fields }: { id: string, title?: string, code?: string, language?: string, description?: string, tags?: string[] }): Promise<Snippet> => {
      const db = await getDb();
      const snippet = db.prepare('SELECT * FROM snippets WHERE id = ?').get(id) as SnippetDB | undefined;
      if (!snippet) throw new Error('Snippet not found');

      const updates = [];
      const values = [];
      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined) {
          updates.push(`${key === 'tags' ? 'tags' : key} = ?`);
          values.push(key === 'tags' ? JSON.stringify(value) : value);
        }
      });

      if (updates.length > 0) {
        const now = new Date().toISOString();
        updates.push('updated_at = ?');
        values.push(now);
        values.push(id);

        db.prepare(
          `UPDATE snippets SET ${updates.join(', ')} WHERE id = ?`
        ).run(...values);

        const updatedSnippet = db.prepare('SELECT * FROM snippets WHERE id = ?').get(id) as SnippetDB;
        return {
          ...updatedSnippet,
          tags: updatedSnippet.tags ? JSON.parse(updatedSnippet.tags) : []
        };
      }

      return {
        ...snippet,
        tags: snippet.tags ? JSON.parse(snippet.tags) : []
      };
    },
    deleteSnippet: async (_parent: unknown, { id }: { id: string }): Promise<boolean> => {
      const db = await getDb();
      const result = db.prepare('DELETE FROM snippets WHERE id = ?').run(id);
      return result.changes > 0;
    }
  }
}; 