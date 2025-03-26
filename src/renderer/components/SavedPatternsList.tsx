import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import styles from './SavedPatternsList.module.css';
import { GET_REGEX_PATTERNS } from '../graphql/queries/getRegexPatterns';

interface SavedPatternsListProps {
  onSelect: (pattern: {
    pattern: string;
    name: string;
    testString?: string;
    tags: string[];
    flags: {
      caseInsensitive: boolean;
      multiline: boolean;
      global: boolean;
    };
  }) => void;
}

const SavedPatternsList: React.FC<SavedPatternsListProps> = ({ onSelect }) => {
  const { loading, error, data } = useQuery(GET_REGEX_PATTERNS);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract unique tags from all patterns
  const allTags = useMemo(() => {
    if (!data?.regexPatterns) return [];
    const tagSet = new Set<string>();
    data.regexPatterns.forEach((pattern: any) => {
      pattern.tags.forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [data?.regexPatterns]);

  // Filter patterns based on selected tags
  const filteredPatterns = useMemo(() => {
    if (!data?.regexPatterns) return [];
    if (selectedTags.length === 0) return data.regexPatterns;
    
    return data.regexPatterns.filter((pattern: any) => 
      selectedTags.every(tag => pattern.tags.includes(tag))
    );
  }, [data?.regexPatterns, selectedTags]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading patterns: {error.message}</div>;

  return (
    <div className={styles.container}>
      {allTags.length > 0 && (
        <div className={styles.tagFilters}>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`${styles.tagFilter} ${selectedTags.includes(tag) ? styles.tagFilterSelected : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filteredPatterns.length === 0 ? (
        <div className={styles.noPatterns}>
          {selectedTags.length > 0 
            ? 'No patterns match the selected tags'
            : 'No saved patterns yet'}
        </div>
      ) : (
        <div className={styles.list}>
          {filteredPatterns.map((pattern: any) => (
            <div
              key={pattern.id}
              className={styles.patternItem}
              onClick={() => onSelect(pattern)}
            >
              <h3>{pattern.name}</h3>
              <code>{pattern.pattern}</code>
              {pattern.tags.length > 0 && (
                <div className={styles.tags}>
                  {pattern.tags.map((tag: string) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPatternsList; 