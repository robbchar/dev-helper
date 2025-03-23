import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index.js';
import { Snippet, CreateSnippetInput, UpdateSnippetInput } from '../types.js';

export const snippetResolvers = {
  Query: {
    snippets: async (): Promise<Snippet[]> => {
      const snippets = await db.all(`
        SELECT * FROM snippets ORDER BY created_at DESC
      `);
      return snippets.map(snippet => ({
        ...snippet,
        tags: JSON.parse(snippet.tags)
      }));
    },
    snippet: async (_: unknown, { id }: { id: string }): Promise<Snippet | null> => {
      const snippet = await db.get('SELECT * FROM snippets WHERE id = ?', id);
      if (!snippet) return null;
      return {
        ...snippet,
        tags: JSON.parse(snippet.tags)
      };
    }
  },
  Mutation: {
    createSnippet: async (_: unknown, input: CreateSnippetInput): Promise<Snippet> => {
      const id = uuidv4();
      const now = new Date().toISOString();
      await db.run(
        `INSERT INTO snippets (id, title, description, code, language, tags, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, input.title, input.description, input.code, input.language, JSON.stringify(input.tags), now, now]
      );
      return {
        id,
        title: input.title,
        description: input.description,
        code: input.code,
        language: input.language,
        tags: input.tags,
        createdAt: now,
        updatedAt: now
      };
    },
    updateSnippet: async (_: unknown, { id, ...fields }: UpdateSnippetInput): Promise<Snippet> => {
      const snippet = await db.get('SELECT * FROM snippets WHERE id = ?', id);
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

        await db.run(
          `UPDATE snippets SET ${updates.join(', ')} WHERE id = ?`,
          values
        );

        const updatedSnippet = await db.get('SELECT * FROM snippets WHERE id = ?', id);
        return {
          ...updatedSnippet,
          tags: JSON.parse(updatedSnippet.tags)
        };
      }

      return {
        ...snippet,
        tags: JSON.parse(snippet.tags)
      };
    },
    deleteSnippet: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
      const result = await db.run('DELETE FROM snippets WHERE id = ?', id);
      return result.changes ? result.changes > 0 : false;
    }
  }
}; 