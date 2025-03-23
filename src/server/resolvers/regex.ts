import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/index.js';

interface RegexPatternDB {
  id: string;
  pattern: string;
  name: string;
  description?: string;
  flags?: string;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

interface RegexPattern {
  id: string;
  pattern: string;
  name: string;
  description?: string;
  flags?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const regexResolvers = {
  Query: {
    async regexPatterns() {
      const db = await getDb();
      const patterns = db.prepare('SELECT * FROM regex_patterns').all() as RegexPatternDB[];
      return patterns.map(pattern => ({
        ...pattern,
        tags: pattern.tags ? JSON.parse(pattern.tags) : []
      }));
    },
    regexPattern: async (_parent: unknown, { id }: { id: string }): Promise<RegexPattern | null> => {
      const db = await getDb();
      const pattern = db.prepare('SELECT * FROM regex_patterns WHERE id = ?').get(id) as RegexPatternDB | undefined;
      if (!pattern) return null;
      return {
        ...pattern,
        tags: pattern.tags ? JSON.parse(pattern.tags) : []
      };
    }
  },
  Mutation: {
    async createRegexPattern(_parent: unknown, { input }: { input: Omit<RegexPattern, 'id' | 'created_at' | 'updated_at'> }) {
      const db = await getDb();
      const id = uuidv4();
      const tags = input.tags ? JSON.stringify(input.tags) : null;
      
      db.prepare(
        `INSERT INTO regex_patterns (id, pattern, name, description, flags, tags)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(id, input.pattern, input.name, input.description, input.flags, tags);

      const pattern = db.prepare('SELECT * FROM regex_patterns WHERE id = ?').get(id) as RegexPatternDB;
      return {
        ...pattern,
        tags: pattern.tags ? JSON.parse(pattern.tags) : []
      };
    },
    updateRegexPattern: async (_parent: unknown, { id, ...fields }: { id: string, pattern?: string, name?: string, description?: string, flags?: string, tags?: string[] }): Promise<RegexPattern> => {
      const db = await getDb();
      const pattern = db.prepare('SELECT * FROM regex_patterns WHERE id = ?').get(id) as RegexPatternDB | undefined;
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

        db.prepare(
          `UPDATE regex_patterns SET ${updates.join(', ')} WHERE id = ?`
        ).run(...values);

        const updatedPattern = db.prepare('SELECT * FROM regex_patterns WHERE id = ?').get(id) as RegexPatternDB;
        return {
          ...updatedPattern,
          tags: updatedPattern.tags ? JSON.parse(updatedPattern.tags) : []
        };
      }

      return {
        ...pattern,
        tags: pattern.tags ? JSON.parse(pattern.tags) : []
      };
    },
    deleteRegexPattern: async (_parent: unknown, { id }: { id: string }): Promise<boolean> => {
      const db = await getDb();
      const result = db.prepare('DELETE FROM regex_patterns WHERE id = ?').run(id);
      return result.changes > 0;
    }
  }
}; 