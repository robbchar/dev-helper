import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Notification from '../Notification';
import { vi } from 'vitest';

describe('Notification', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders with message and type', () => {
    render(
      <Notification
        message="Test notification"
        type="success"
        onClose={mockOnClose}
        id="0"
      />
    );

    expect(screen.getByText('Test notification')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows OK button for persistent notifications', () => {
    render(
      <Notification
        message="Test notification"
        type="warning"
        persistent={true}
        onClose={mockOnClose}
        id="0"
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2); // OK button and close button
  });

  it('auto-dismisses after 5 seconds', () => {
    render(
      <Notification
        message="Test notification"
        type="info"
        onClose={mockOnClose}
        id="0"
      />
    );

    act(() => {
      vi.advanceTimersByTime(5000);
      vi.runAllTimers();
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not auto-dismiss when persistent', () => {
    render(
      <Notification
        message="Test notification"
        type="error"
        persistent={true}
        onClose={mockOnClose}
        id="0"
      />
    );

    act(() => {
      vi.advanceTimersByTime(5000);
      vi.runAllTimers();
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Notification
        message="Test notification"
        type="success"
        onClose={mockOnClose}
        id="0"
      />
    );

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    act(() => {
      vi.advanceTimersByTime(300);
      vi.runAllTimers();
    });

    expect(mockOnClose).toHaveBeenCalled();
  });
}); 