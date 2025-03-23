import React from 'react';
import { render, screen } from '@testing-library/react';
import Snippets from '../Snippets';
import { vi } from 'vitest';

describe('Snippets', () => {
  beforeEach(() => {
    // Mock window.showNotification
    Object.defineProperty(window, 'showNotification', {
      value: vi.fn(),
      writable: true
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the snippets page', () => {
    render(<Snippets />);
    expect(screen.getByText('Code Snippets')).toBeInTheDocument();
  });
}); 