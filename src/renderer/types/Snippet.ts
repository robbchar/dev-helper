export interface Snippet {
  id: string;
  title: string;
  description: string | undefined;
  code: string;
  language: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateSnippetInput {
  title: string;
  description: string | undefined;
  code: string;
  language: string;
  tags: string[];
}

export interface UpdateSnippetInput {
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  tags?: string[];
} 