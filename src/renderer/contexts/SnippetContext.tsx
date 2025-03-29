import React, { createContext, useContext, ReactNode } from 'react';
import { useApolloClient } from '@apollo/client';
import type { Snippet } from '../types/Snippet';
import { GET_SNIPPETS } from '../graphql/queries/getSnippets';

interface FormState {
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
}

interface SnippetContextType {
  snippets: Snippet[];
  setSnippets: (snippets: Snippet[]) => void;
  selectedSnippet: Snippet | null;
  setSelectedSnippet: (snippet: Snippet | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  // Form state
  formState: FormState;
  setFormState: (state: FormState) => void;
}

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

export const SnippetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const client = useApolloClient();
  const [snippets, setSnippets] = React.useState<Snippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = React.useState<Snippet | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [formState, setFormState] = React.useState<FormState>({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    tags: []
  });

  // Keep selectedSnippet in sync with Apollo cache
  React.useEffect(() => {
    const cacheData = client.readQuery({ query: GET_SNIPPETS });
    if (!cacheData?.snippets) return;

    // If we have a selected snippet, make sure it exists in the cache
    if (selectedSnippet) {
      const exists = cacheData.snippets.some((s: Snippet) => s.id === selectedSnippet.id);
      if (!exists) {
        setSelectedSnippet(null);
      }
    }
  }, [client, selectedSnippet]);

  // Update form state when selectedSnippet changes
  React.useEffect(() => {
    if (selectedSnippet) {
      setFormState({
        title: selectedSnippet.title,
        description: selectedSnippet.description || '',
        code: selectedSnippet.code,
        language: selectedSnippet.language,
        tags: selectedSnippet.tags
      });
    } else {
      setFormState({
        title: '',
        description: '',
        code: '',
        language: 'javascript',
        tags: []
      });
    }
  }, [selectedSnippet]);

  return (
    <SnippetContext.Provider value={{
      snippets,
      setSnippets,
      selectedSnippet,
      setSelectedSnippet,
      searchQuery,
      setSearchQuery,
      selectedTags,
      setSelectedTags,
      formState,
      setFormState
    }}>
      {children}
    </SnippetContext.Provider>
  );
};

export const useSnippet = () => {
  const context = useContext(SnippetContext);
  if (context === undefined) {
    throw new Error('useSnippet must be used within a SnippetProvider');
  }
  return context;
}; 