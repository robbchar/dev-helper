import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import styles from './SavedSnippetsList.module.css';
import { GET_SNIPPETS } from '../graphql/queries/getSnippets';
import type { Snippet } from '../types/Snippet';
import { useSnippet } from '../contexts/SnippetContext';

interface SavedSnippetsListProps {
  onSelect: (snippet: Snippet) => void;
}

interface SnippetsQueryResult {
  snippets: Snippet[];
}

const SavedSnippetsList: React.FC<SavedSnippetsListProps> = ({ onSelect }) => {
  const { searchQuery, setSearchQuery, selectedTags, setSelectedTags } = useSnippet();
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([]);

  const { data, loading } = useQuery<SnippetsQueryResult>(GET_SNIPPETS);

  const allTags = useMemo(() => {
    if (!data?.snippets) return [];
    return Array.from(new Set(data.snippets.flatMap((snippet: Snippet) => snippet.tags)));
  }, [data?.snippets]);

  const allLanguages = useMemo(() => {
    if (!data?.snippets) return [];
    return Array.from(new Set(data.snippets.map((snippet: Snippet) => snippet.language)));
  }, [data?.snippets]);

  const filteredSnippets = useMemo(() => {
    if (!data?.snippets) return [];
    return data.snippets.filter((snippet: Snippet) => {
      const matchesSearch = searchQuery === '' || 
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (snippet.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => snippet.tags.includes(tag));

      const matchesLanguage = selectedLanguages.length === 0 ||
        selectedLanguages.includes(snippet.language);

      return matchesSearch && matchesTags && matchesLanguage;
    });
  }, [data?.snippets, searchQuery, selectedTags, selectedLanguages]);

  if (loading) {
    return <div className={styles.loading}>Loading snippets...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search snippets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.filterSection}>
        {allLanguages.length > 0 && (
          <div className={styles.languages} data-testid="languages-section">
            <span className={styles.filterLabel}>Languages:</span>
            {allLanguages.map((language) => (
              <button
                key={language}
                className={`${styles.tag} ${selectedLanguages.includes(language) ? styles.selected : ''}`}
                onClick={() => {
                  if (selectedLanguages.includes(language)) {
                    setSelectedLanguages(selectedLanguages.filter(l => l !== language));
                  } else {
                    setSelectedLanguages([...selectedLanguages, language]);
                  }
                }}
              >
                {language}
              </button>
            ))}
          </div>
        )}

        {allTags.length > 0 && (
          <div className={styles.tags} data-testid="tags-section">
            <span className={styles.filterLabel}>Tags:</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`${styles.tag} ${selectedTags.includes(tag) ? styles.selected : ''}`}
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag));
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.list}>
        {filteredSnippets.map((snippet) => (
          <div
            key={snippet.id}
            className={styles.snippet}
            onClick={() => onSelect(snippet)}
          >
            <div className={styles.header}>
              <h3>{snippet.title}</h3>
            </div>
            {snippet.description && (
              <p className={styles.description}>{snippet.description}</p>
            )}
            <div className={styles.metadata}>
              <span className={styles.language}>{snippet.language}</span>
              <span className={styles.date}>
                {new Date(snippet.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.tags}>
              {snippet.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedSnippetsList; 