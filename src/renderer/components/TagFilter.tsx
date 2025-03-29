import React from 'react';
import type { Snippet } from '../types/Snippet';
import styles from './TagFilter.module.css';

interface TagFilterProps {
  snippets: Snippet[];
  selectedTags: string[];
  onSelectTags: (tags: string[]) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({
  snippets,
  selectedTags,
  onSelectTags
}) => {
  const allTags = Array.from(new Set(snippets.flatMap(snippet => snippet.tags)));

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onSelectTags(newTags);
  };

  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3>Filter by Tags</h3>
      <div className={styles.tags}>
        {allTags.map(tag => (
          <button
            key={tag}
            className={`${styles.tag} ${selectedTags.includes(tag) ? styles.selected : ''}`}
            onClick={() => handleTagToggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter; 