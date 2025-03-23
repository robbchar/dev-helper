export interface Snippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RegexPattern {
  id: string;
  pattern: string;
  name: string;
  description?: string;
  flags: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSnippetInput {
  title: string;
  description?: string;
  code: string;
  language: string;
  tags: string[];
}

export interface UpdateSnippetInput {
  id: string;
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  tags?: string[];
}

export interface CreateRegexPatternInput {
  pattern: string;
  name: string;
  description?: string;
  flags: string;
  tags: string[];
}

export interface UpdateRegexPatternInput {
  id: string;
  pattern?: string;
  name?: string;
  description?: string;
  flags?: string;
  tags?: string[];
} 