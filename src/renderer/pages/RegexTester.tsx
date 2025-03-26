import React, { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import pageStyles from './Page.module.css';
import regexStyles from './RegexTester.module.css';
import { SAVE_REGEX_PATTERN } from '../graphql/mutations/saveRegexPattern';
import Modal from '../components/Modal';
import SavedPatternsList from '../components/SavedPatternsList';
import type { SaveRegexPatternInput, RegexPattern } from '../types/RegexPattern';
import { GET_REGEX_PATTERNS } from '../graphql/queries/getRegexPatterns';

interface RegexFlags {
  caseInsensitive: boolean;
  multiline: boolean;
  global: boolean;
}

const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [patternName, setPatternName] = useState('');
  const [tags, setTags] = useState('');
  const [flags, setFlags] = useState<RegexFlags>({
    caseInsensitive: false,
    multiline: false,
    global: false
  });
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [matches, setMatches] = useState<RegExpMatchArray[] | null>(null);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

  const [saveRegexPattern, { loading: isSaving }] = useMutation<
    { createRegexPattern: RegexPattern },
    { input: SaveRegexPatternInput }
  >(SAVE_REGEX_PATTERN, {
    onError: (error) => {
      (window as any).showNotification(error.message, 'error');
    },
    onCompleted: () => {
      // Clear form after successful save
      setPatternName('');
      setTags('');
      setSaveError(null);
      (window as any).showNotification('Pattern saved successfully!', 'success');
    },
    update: (cache, { data }) => {
      if (!data) return;

      // Read the current patterns from the cache
      const existingPatterns = cache.readQuery<{
        regexPatterns: RegexPattern[];
      }>({
        query: GET_REGEX_PATTERNS
      });

      // Write back to the cache with the new pattern included
      cache.writeQuery({
        query: GET_REGEX_PATTERNS,
        data: {
          regexPatterns: [
            data.createRegexPattern,
            ...(existingPatterns?.regexPatterns || [])
          ]
        }
      });
    }
  });

  const updateRegex = useCallback(() => {
    try {
      setError(null);
      if (!pattern) {
        setMatches(null);
        return;
      }

      const flagString = Object.entries(flags)
        .filter(([_, value]) => value)
        .map(([key]) => {
          switch (key) {
            case 'caseInsensitive': return 'i';
            case 'multiline': return 'm';
            case 'global': return 'g';
            default: return '';
          }
        })
        .join('');
      
      const regex = new RegExp(pattern, flagString);
      let result: RegExpMatchArray[] = [];
      if (flags.global) {
        result = [...testString.matchAll(regex)];
      } else {
        const match = testString.match(regex);
        if (match) {
          result = [match];
        }
      }
      
      setMatches(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid regex pattern');
      setMatches(null);
    }
  }, [pattern, testString, flags]);

  useEffect(() => {
    if (pattern && testString) {
      updateRegex();
    } else {
      setMatches(null);
      setError(null);
    }
  }, [pattern, testString, flags, updateRegex]);

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPattern(e.target.value);
  };

  const handleTestStringChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTestString(e.target.value);
  };

  const handleFlagToggle = (flag: keyof RegexFlags) => {
    setFlags(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }));
  };

  const handleSave = async () => {
    if (!pattern || !patternName) {
      (window as any).showNotification('Pattern and pattern name are required', 'error');
      return;
    }

    try {
      // Clean the flags object to remove __typename
      const cleanFlags = {
        caseInsensitive: flags.caseInsensitive,
        multiline: flags.multiline,
        global: flags.global
      };

      await saveRegexPattern({
        variables: {
          input: {
            name: patternName,
            pattern,
            testString,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            flags: cleanFlags
          }
        }
      });
    } catch (err) {
      // Error is handled by onError in mutation options
    }
  };

  const handleLoadPattern = (selectedPattern: {
    pattern: string;
    name: string;
    testString?: string;
    tags: string[];
    flags: RegexFlags;
  }) => {
    setPattern(selectedPattern.pattern);
    setPatternName(selectedPattern.name);
    if (selectedPattern.testString) {
      setTestString(selectedPattern.testString);
    }
    setTags(selectedPattern.tags.join(', '));
    setFlags(selectedPattern.flags);
    setIsLoadModalOpen(false);
  };

  return (
    <div className={pageStyles.container}>
      <h1 className={pageStyles.title}>Regex Tester</h1>
      <div className={pageStyles.content}>
        <div className={pageStyles.inputGroup}>
          <label htmlFor="pattern">Pattern:</label>
          <input
            id="pattern"
            type="text"
            value={pattern}
            onChange={handlePatternChange}
            className={error ? pageStyles.error : ''}
          />
          {error && (window as any).showNotification(error, 'error')}
        </div>

        <div className={pageStyles.inputGroup}>
          <label htmlFor="testString">Test String:</label>
          <textarea
            id="testString"
            value={testString}
            onChange={handleTestStringChange}
            rows={5}
          />
        </div>

        <div className={pageStyles.flags}>
          <label>
            <input
              type="checkbox"
              checked={flags.caseInsensitive}
              onChange={() => handleFlagToggle('caseInsensitive')}
            />
            Case Insensitive (i)
          </label>
          <label>
            <input
              type="checkbox"
              checked={flags.multiline}
              onChange={() => handleFlagToggle('multiline')}
            />
            Multiline (m)
          </label>
          <label>
            <input
              type="checkbox"
              checked={flags.global}
              onChange={() => handleFlagToggle('global')}
            />
            Global (g)
          </label>
        </div>

        <div className={regexStyles.results}>
          <h3>Results</h3>
          {error ? (
            <div className={pageStyles.errorMessage}>{error}</div>
          ) : matches ? (
            <div className={regexStyles.matches}>
              <div className={regexStyles.highlightedText} data-testid="highlighted-text">
                {testString.split('').map((char, index) => {
                  const isMatch = matches.some(match => {
                    const matchStart = testString.indexOf(match[0]);
                    return index >= matchStart && index < matchStart + match[0].length;
                  });
                  return (
                    <span key={index} className={isMatch ? regexStyles.highlighted : ''}>
                      {char}
                    </span>
                  );
                })}
              </div>
              {matches.length > 0 ? (
                matches.map((match, index) => (
                  <div key={index} className={regexStyles.match} data-testid={`match-${index}`}>
                    <div className={regexStyles.matchIndex} data-testid={`match-index-${index}`}>
                      Match {index + 1}:
                    </div>
                    <div className={regexStyles.matchText} data-testid={`match-text-${index}`}>
                      {match[0]}
                    </div>
                    {match.length > 1 && (
                      <div className={regexStyles.groups}>
                        {match.slice(1).map((group: string, groupIndex: number) => (
                          <div key={groupIndex} className={regexStyles.group} data-testid={`group-${index}-${groupIndex}`}>
                            Group {groupIndex + 1}: {group}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={regexStyles.noMatch} data-testid="no-matches">No matches found</div>
              )}
            </div>
          ) : (
            <div className={regexStyles.noMatch} data-testid="no-pattern">Enter a pattern and test string to see matches</div>
          )}
        </div>

        <div className={pageStyles.saveSection}>
          <div className={pageStyles.inputGroup}>
            <label htmlFor="patternName">Pattern Name:</label>
            <input
              id="patternName"
              type="text"
              value={patternName}
              onChange={(e) => setPatternName(e.target.value)}
              className={saveError && !patternName ? pageStyles.error : ''}
            />
          </div>
          <div className={pageStyles.inputGroup}>
            <label htmlFor="tags">Tags (comma-separated):</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className={pageStyles.buttonGroup}>
            <button 
              onClick={handleSave} 
              className={pageStyles.button}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Pattern'}
            </button>
            <button 
              onClick={() => setIsLoadModalOpen(true)}
              className={pageStyles.button}
            >
              Load Pattern
            </button>
          </div>
          {saveError && <div className={pageStyles.errorMessage}>{saveError}</div>}
        </div>
      </div>

      <Modal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        title="Load Saved Pattern"
      >
        <SavedPatternsList onSelect={handleLoadPattern} />
      </Modal>
    </div>
  );
};

export default RegexTester; 