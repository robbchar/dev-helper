import React, { useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { lintGutter } from '@codemirror/lint';
import pageStyles from './Page.module.css';
import jsonStyles from './JsonFormatter.module.css';
import { useJsonFormatter } from '../contexts/JsonFormatterContext';

const JsonFormatter: React.FC = () => {
  const { value, setValue } = useJsonFormatter();
  const [error, setError] = React.useState<string | null>(null);
  const editorRef = useRef<any>(null);

  const onChange = useCallback((value: string) => {
    setValue(value);
    try {
      JSON.parse(value);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  }, [setValue]);

  const formatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      setValue(formatted);
      setError(null);
      (window as any).showNotification('JSON formatted successfully', 'success');
      setTimeout(() => editorRef.current?.view?.focus(), 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      (window as any).showNotification('Cannot format invalid JSON', 'error');
    }
  }, [value, setValue]);

  const minifyJson = useCallback(() => {
    try {
      const parsed = JSON.parse(value);
      const minified = JSON.stringify(parsed);
      setValue(minified);
      setError(null);
      (window as any).showNotification('JSON minified successfully', 'success');
      setTimeout(() => editorRef.current?.view?.focus(), 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      (window as any).showNotification('Cannot minify invalid JSON', 'error');
    }
  }, [value, setValue]);

  return (
    <div className={pageStyles.container}>
      <h1 className={pageStyles.title}>JSON Formatter</h1>
      <div className={pageStyles.content}>
        <div className={pageStyles.buttonGroup}>
          <button onClick={formatJson}>
            Format JSON
          </button>
          <button onClick={minifyJson}>
            Minify JSON
          </button>
        </div>
        <div className={jsonStyles.editorContainer}>
          <CodeMirror
            ref={editorRef}
            value={value}
            height="500px"
            theme={oneDark}
            extensions={[
              json(),
              lintGutter()
            ]}
            onChange={onChange}
          />
        </div>
        {error && (
          <div className={pageStyles.errorMessage}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonFormatter; 