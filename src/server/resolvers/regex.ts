import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index.js';
import { RegexPattern, CreateRegexPatternInput, UpdateRegexPatternInput } from '../types.js';

export const regexResolvers = {
  Query: {
    regexPatterns: async (): Promise<RegexPattern[]> => {
      const patterns = await db.all(`
        SELECT * FROM regex_patterns ORDER BY created_at DESC
      `);
      return patterns.map(pattern => ({
        ...pattern,
        tags: JSON.parse(pattern.tags)
      }));
    },
    regexPattern: async (_: unknown, { id }: { id: string }): Promise<RegexPattern | null> => {
      const pattern = await db.get('SELECT * FROM regex_patterns WHERE id = ?', id);
      if (!pattern) return null;
      return {
        ...pattern,
        tags: JSON.parse(pattern.tags)
      };
    }
  },
  Mutation: {
    createRegexPattern: async (_: unknown, input: CreateRegexPatternInput): Promise<RegexPattern> => {
      const id = uuidv4();
      const now = new Date().toISOString();
      await db.run(
        `INSERT INTO regex_patterns (id, pattern, name, description, flags, tags, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, input.pattern, input.name, input.description, input.flags, JSON.stringify(input.tags), now, now]
      );
      return {
        id,
        pattern: input.pattern,
        name: input.name,
        description: input.description,
        flags: input.flags,
        tags: input.tags,
        createdAt: now,
        updatedAt: now
      };
    },
    updateRegexPattern: async (_: unknown, { id, ...fields }: UpdateRegexPatternInput): Promise<RegexPattern> => {
      const pattern = await db.get('SELECT * FROM regex_patterns WHERE id = ?', id);
      if (!pattern) throw new Error('Regex pattern not found');

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
          `UPDATE regex_patterns SET ${updates.join(', ')} WHERE id = ?`,
          values
        );

        const updatedPattern = await db.get('SELECT * FROM regex_patterns WHERE id = ?', id);
        return {
          ...updatedPattern,
          tags: JSON.parse(updatedPattern.tags)
        };
      }

      return {
        ...pattern,
        tags: JSON.parse(pattern.tags)
      };
    },
    deleteRegexPattern: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
      const result = await db.run('DELETE FROM regex_patterns WHERE id = ?', id);
      return result.changes ? result.changes > 0 : false;
    }
  }
}; 