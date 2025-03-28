import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JsonFormatter from '../JsonFormatter';
import { vi } from 'vitest';
import { JsonFormatterProvider } from '../../contexts/JsonFormatterContext';

// Mock window.showNotification
const mockShowNotification = vi.fn();
(window as any).showNotification = mockShowNotification;

// Mock CodeMirror's onChange
vi.mock('@uiw/react-codemirror', () => {
  return {
    default: function MockCodeMirror({ onChange, value }: { onChange: (value: string) => void; value: string }) {
      return (
        <textarea
          data-testid="json-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }
  };
});

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <JsonFormatterProvider>
      {ui}
    </JsonFormatterProvider>
  );
};

describe('JsonFormatter', () => {
  beforeEach(() => {
    mockShowNotification.mockClear();
  });

  it('renders the JSON formatter component', () => {
    renderWithProvider(<JsonFormatter />);
    expect(screen.getByText('JSON Formatter')).toBeInTheDocument();
    expect(screen.getByText('Format JSON')).toBeInTheDocument();
    expect(screen.getByText('Minify JSON')).toBeInTheDocument();
  });

  it('formats valid JSON when clicking the Format JSON button', () => {
    renderWithProvider(<JsonFormatter />);
    const editor = screen.getByTestId('json-editor');
    const formatButton = screen.getByText('Format JSON');

    // Input some unformatted JSON
    fireEvent.change(editor, { target: { value: '{"name":"test","value":123}' } });
    
    // Click format button
    fireEvent.click(formatButton);

    // Check if the JSON is formatted
    expect(editor).toHaveValue('{\n  "name": "test",\n  "value": 123\n}');
    expect(mockShowNotification).toHaveBeenCalledWith('JSON formatted successfully', 'success');
  });

  it('minifies valid JSON when clicking the Minify JSON button', () => {
    renderWithProvider(<JsonFormatter />);
    const editor = screen.getByTestId('json-editor');
    const minifyButton = screen.getByText('Minify JSON');

    // Input some formatted JSON
    fireEvent.change(editor, { target: { value: '{\n  "name": "test",\n  "value": 123\n}' } });
    
    // Click minify button
    fireEvent.click(minifyButton);

    // Check if the JSON is minified
    expect(editor).toHaveValue('{"name":"test","value":123}');
    expect(mockShowNotification).toHaveBeenCalledWith('JSON minified successfully', 'success');
  });

  it('shows error message for invalid JSON', async () => {
    renderWithProvider(<JsonFormatter />);
    const editor = screen.getByTestId('json-editor');
    const formatButton = screen.getByText('Format JSON');

    // Input invalid JSON
    fireEvent.change(editor, { target: { value: '{invalid json}' } });
    
    // Click format button
    fireEvent.click(formatButton);

    // Check if error message is shown
    expect(await screen.findByText('Expected property name or \'}\' in JSON at position 1 (line 1 column 2)')).toBeInTheDocument();
    expect(mockShowNotification).toHaveBeenCalledWith('Cannot format invalid JSON', 'error');
  });
}); 