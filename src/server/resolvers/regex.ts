import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/index.js';

interface RegexPatternDB {
  id: string;
  pattern: string;
  name: string;
  testString?: string;
  flags: string;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

interface RegexPattern {
  id: string;
  pattern: string;
  name: string;
  testString?: string;
  flags: {
    caseInsensitive: boolean;
    multiline: boolean;
    global: boolean;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

function transformDBToPattern(dbPattern: RegexPatternDB): RegexPattern {
  return {
    id: dbPattern.id,
    pattern: dbPattern.pattern,
    name: dbPattern.name,
    testString: dbPattern.testString,
    flags: dbPattern.flags ? JSON.parse(dbPattern.flags) : { caseInsensitive: false, multiline: false, global: false },
    tags: dbPattern.tags ? JSON.parse(dbPattern.tags) : [],
    createdAt: dbPattern.created_at,
    updatedAt: dbPattern.updated_at
  };
}

export const regexResolvers = {
  Query: {
    async regexPatterns() {
      const db = await getDb();
      const patterns = db.prepare('SELECT * FROM regex_patterns').all() as RegexPatternDB[];
      return patterns.map(transformDBToPattern);
    },
    regexPattern: async (_parent: unknown, { id }: { id: string }): Promise<RegexPattern | null> => {
      const db = await getDb();
      const pattern = db.prepare('SELECT * FROM regex_patterns WHERE id = ?').get(id) as RegexPatternDB | undefined;
      if (!pattern) return null;
      return transformDBToPattern(pattern);
    }
  },
  Mutation: {
    async createRegexPattern(_parent: unknown, { input }: { input: { pattern: string, name: string, testString?: string, flags: { caseInsensitive: boolean, multiline: boolean, global: boolean }, tags?: string[] } }) {
      const db = await getDb();

      // Check if a pattern with this name already exists
      const existingPattern = db.prepare('SELECT id FROM regex_patterns WHERE name = ?').get(input.name);
      if (existingPattern) {
        throw new Error(`A pattern with the name "${input.name}" already exists`);
      }

      const id = uuidv4();
      const now = new Date().toISOString();
      const tags = input.tags ? JSON.stringify(input.tags) : null;
      const flags = JSON.stringify(input.flags);
      
      console.log('Creating regex pattern with input:', {
        ...input,
        testString: input.testString || 'null'
      });
      
      db.prepare(
        `INSERT INTO regex_patterns (id, pattern, name, testString, flags, tags, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(id, input.pattern, input.name, input.testString, flags, tags, now, now);

      const pattern = db.prepare('SELECT * FROM regex_patterns WHERE id = ?').get(id) as RegexPatternDB;
      console.log('Saved pattern:', pattern);
      return transformDBToPattern(pattern);
    },
    updateRegexPattern: async (_parent: unknown, { id, ...fields }: { id: string, pattern?: string, name?: string, testString?: string, flags?: string, tags?: string[] }): Promise<RegexPattern> => {
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
        return transformDBToPattern(updatedPattern);
      }

      return transformDBToPattern(pattern);
    },
    deleteRegexPattern: async (_parent: unknown, { id }: { id: string }): Promise<boolean> => {
      const db = await getDb();
      const result = db.prepare('DELETE FROM regex_patterns WHERE id = ?').run(id);
      return result.changes > 0;
    }
  }
}; 