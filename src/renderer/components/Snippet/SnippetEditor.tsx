import React from 'react';
import type { CreateSnippetInput, UpdateSnippetInput } from '../../types/Snippet';
import styles from './SnippetEditor.module.css';
import pageStyles from '../../pages/Page.module.css';
import { useSnippet } from '../../contexts/SnippetContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Define supported languages
const supportedLanguages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'css',
  'json',
  'markdown',
  'bash',
  'sql'
] as const;

interface SnippetEditorProps {
  onCreate: (input: CreateSnippetInput) => void;
  onUpdate: (input: UpdateSnippetInput) => void;
  onDelete: () => void;
  loading: boolean;
}

const SnippetEditor: React.FC<SnippetEditorProps> = ({
  onCreate,
  onUpdate,
  onDelete,
  loading
}) => {
  const { selectedSnippet, formState, setFormState, snippets } = useSnippet();
  const [newTag, setNewTag] = React.useState('');

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const input = {
      title: formState.title,
      description: formState.description,
      code: formState.code,
      language: formState.language,
      tags: formState.tags
    };

    if (selectedSnippet?.id) {
      onUpdate(input);
    } else {
      onCreate(input);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag && !formState.tags.includes(newTag)) {
      setFormState({
        ...formState,
        tags: [...formState.tags, newTag]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormState({
      ...formState,
      tags: formState.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Check if a snippet with the same title exists (excluding the current snippet)
  const hasDuplicateTitle = Boolean(formState.title && snippets.some(snippet => 
    snippet.title === formState.title && snippet.id !== selectedSnippet?.id
  ));

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={formState.title}
            onChange={(e) => setFormState({ ...formState, title: e.target.value })}
            placeholder="Enter snippet title"
            className={styles.input}
          />
          {hasDuplicateTitle && (
            <div className={styles.error}>
              A snippet with this title already exists
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            placeholder="Enter snippet description"
            className={styles.textarea}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="language">Language</label>
          <select
            id="language"
            value={formState.language}
            onChange={(e) => setFormState({ ...formState, language: e.target.value })}
            className={styles.select}
          >
            {supportedLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="code">Code</label>
          <div className={styles.codeEditor}>
            <textarea
              id="code"
              value={formState.code}
              onChange={(e) => setFormState({ ...formState, code: e.target.value })}
              placeholder="Enter your code here"
              className={styles.codeInput}
              spellCheck="false"
            />
            <div className={styles.codePreview}>
              <SyntaxHighlighter
                language={formState.language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  height: '100%',
                  overflow: 'auto',
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
              >
                {formState.code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label>Tags</label>
          <div className={styles.tagsSection}>
            {formState.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className={styles.removeTag}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className={pageStyles.saveSection}>
          <form onSubmit={handleAddTag} className={styles.addTagForm}>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
            />
            <button type="submit">Add</button>
          </form>
          <div className={pageStyles.buttonGroup}>
            <button
              onClick={handleSubmit} 
              disabled={loading || hasDuplicateTitle}
            >
              {loading ? 'Saving...' : 
               hasDuplicateTitle ? 'Duplicate Title' :
               selectedSnippet?.id ? 'Update Snippet' : 'Create Snippet'}
            </button>
            {selectedSnippet && (
              <button
                type="button"
                onClick={onDelete}
                className={styles.deleteButton}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnippetEditor; 