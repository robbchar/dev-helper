import React from 'react';
import type { Snippet } from '../types/Snippet';
import styles from './SnippetList.module.css';

interface SnippetListProps {
  snippets: Snippet[];
  selectedSnippet: Snippet | null;
  onSelectSnippet: (snippet: Snippet) => void;
  onDelete: () => void;
  loading: boolean;
}

const SnippetList: React.FC<SnippetListProps> = ({
  snippets,
  selectedSnippet,
  onSelectSnippet,
  onDelete,
  loading
}) => {
  if (loading) {
    return <div className={styles.loading}>Loading snippets...</div>;
  }

  if (snippets.length === 0) {
    return <div className={styles.empty}>No snippets found</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Snippets</h2>
      <div className={styles.list}>
        {snippets.map(snippet => (
          <div
            key={snippet.id}
            className={`${styles.snippet} ${selectedSnippet?.id === snippet.id ? styles.selected : ''}`}
            onClick={() => onSelectSnippet(snippet)}
          >
            <div className={styles.header}>
              <h3>{snippet.title}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className={styles.deleteButton}
              >
                ×
              </button>
            </div>
            <p className={styles.description}>{snippet.description}</p>
            <div className={styles.tags}>
              {snippet.tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.meta}>
              <span className={styles.language}>{snippet.language}</span>
              <span className={styles.date}>
                {new Date(snippet.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SnippetList; 