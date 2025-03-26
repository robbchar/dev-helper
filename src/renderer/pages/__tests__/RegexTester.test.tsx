import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { FetchResult } from '@apollo/client';
import RegexTester from '../RegexTester';
import { SAVE_REGEX_PATTERN } from '../../graphql/mutations/saveRegexPattern';
import { vi } from 'vitest';

// Mock window.showNotification
const mockShowNotification = vi.fn();
(window as any).showNotification = mockShowNotification;

beforeEach(() => {
  mockShowNotification.mockClear();
});

const mocks = [
  {
    request: {
      query: SAVE_REGEX_PATTERN,
      variables: {
        input: {
          name: 'Phone Number',
          pattern: '\\d{3}-\\d{3}-\\d{4}',
          testString: '',
          tags: ['phone', 'validation'],
          flags: {
            caseInsensitive: false,
            multiline: false,
            global: false
          }
        }
      }
    },
    result: {
      data: {
        createRegexPattern: {
          id: '1',
          name: 'Phone Number',
          pattern: '\\d{3}-\\d{3}-\\d{4}',
          testString: '',
          tags: ['phone', 'validation'],
          flags: {
            caseInsensitive: false,
            multiline: false,
            global: false
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      }
    }
  }
];

describe('RegexTester', () => {
  it('renders the regex tester interface', () => {
    render(
      <MockedProvider>
        <RegexTester />
      </MockedProvider>
    );
    
    expect(screen.getByLabelText('Pattern:')).toBeInTheDocument();
    expect(screen.getByLabelText('Test String:')).toBeInTheDocument();
    expect(screen.getByLabelText('Case Insensitive (i)')).toBeInTheDocument();
    expect(screen.getByLabelText('Multiline (m)')).toBeInTheDocument();
    expect(screen.getByLabelText('Global (g)')).toBeInTheDocument();
  });

  it('matches simple patterns correctly', async () => {
    render(
      <MockedProvider>
        <RegexTester />
      </MockedProvider>
    );
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    
    await userEvent.type(patternInput, '\\d+');
    await userEvent.type(testStringInput, 'abc 123 def');
    
    // Verify the match is in the results section
    const matchText = screen.getByTestId('match-text-0');
    expect(matchText).toHaveTextContent('123');
    
    // Verify no other matches exist
    expect(screen.queryByTestId('match-text-1')).not.toBeInTheDocument();
  });

  it('handles regex flags correctly', async () => {
    render(
      <MockedProvider>
        <RegexTester />
      </MockedProvider>
    );
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    const globalFlag = screen.getByLabelText('Global (g)');
    
    await userEvent.type(patternInput, '\\d+');
    await userEvent.type(testStringInput, '123 456 789');
    await userEvent.click(globalFlag);
    
    // Verify all matches are in the results section
    expect(screen.getByTestId('match-text-0')).toHaveTextContent('123');
    expect(screen.getByTestId('match-text-1')).toHaveTextContent('456');
    expect(screen.getByTestId('match-text-2')).toHaveTextContent('789');
    expect(screen.queryByTestId('match-text-3')).not.toBeInTheDocument();
    
    // Verify match indices
    expect(screen.getByTestId('match-index-0')).toHaveTextContent('Match 1:');
    expect(screen.getByTestId('match-index-1')).toHaveTextContent('Match 2:');
    expect(screen.getByTestId('match-index-2')).toHaveTextContent('Match 3:');
  });

  it('handles case insensitive flag correctly', async () => {
    render(
      <MockedProvider>
        <RegexTester />
      </MockedProvider>
    );
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    const caseInsensitiveFlag = screen.getByLabelText('Case Insensitive (i)');
    
    await userEvent.type(patternInput, 'hello');
    await userEvent.type(testStringInput, 'Hello World');
    await userEvent.click(caseInsensitiveFlag);
    
    const matchText = screen.getByTestId('match-text-0');
    expect(matchText).toHaveTextContent('Hello');
    expect(screen.queryByTestId('match-text-1')).not.toBeInTheDocument();
  });

  it('displays error for invalid regex pattern', async () => {
    render(
      <MockedProvider>
        <RegexTester />
      </MockedProvider>
    );
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    
    fireEvent.change(patternInput, { target: { value: '[invalid' } });
    fireEvent.change(testStringInput, { target: { value: 'test string' } });
    
    expect(mockShowNotification).toHaveBeenCalledWith(expect.stringContaining('Invalid regular expression'), 'error');
  });

  it('handles regex groups correctly', async () => {
    render(
      <MockedProvider>
        <RegexTester />
      </MockedProvider>
    );
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    
    await userEvent.type(patternInput, '(\\w+)@(\\w+\\.\\w+)');
    await userEvent.type(testStringInput, 'test@example.com');
    
    // Verify the full match
    expect(screen.getByTestId('match-text-0')).toHaveTextContent('test@example.com');
    
    // Verify groups
    expect(screen.getByTestId('group-0-0')).toHaveTextContent('Group 1: test');
    expect(screen.getByTestId('group-0-1')).toHaveTextContent('Group 2: example.com');
  });

  it('shows no matches message when pattern does not match', async () => {
    render(
      <MockedProvider>
        <RegexTester />
      </MockedProvider>
    );
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    
    await userEvent.type(patternInput, '\\d+');
    await userEvent.type(testStringInput, 'abc');
    
    expect(screen.getByTestId('no-matches')).toBeInTheDocument();
  });

  it('clears matches when pattern is empty', async () => {
    render(
      <MockedProvider>
        <RegexTester />
      </MockedProvider>
    );
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    
    await userEvent.type(patternInput, '\\d+');
    await userEvent.type(testStringInput, '123');
    
    expect(screen.getByTestId('match-text-0')).toHaveTextContent('123');
    
    await userEvent.clear(patternInput);
    expect(screen.getByTestId('no-pattern')).toBeInTheDocument();
  });

  describe('save functionality', () => {

    it('shows error when saving without required fields', async () => {
      render(
        <MockedProvider mocks={[]}>
          <RegexTester />
        </MockedProvider>
      );
      
      // Try to save without pattern or name
      const saveButton = await screen.findByText('Save Pattern');
      await userEvent.click(saveButton);
      
      expect(mockShowNotification).toHaveBeenCalledWith('Pattern and pattern name are required', 'error');
    });
    
    // it('saves pattern successfully', async () => {
    //   render(
    //     <MockedProvider mocks={mocks} addTypename={false}>
    //       <RegexTester />
    //     </MockedProvider>
    //   );
      
    //   // Fill in the pattern
    //   await userEvent.type(screen.getByLabelText('Pattern:'), '\\d{3}-\\d{3}-\\d{4}');
      
    //   // Fill in save details
    //   await userEvent.type(screen.getByLabelText('Pattern Name:'), 'Phone Number');
    //   await userEvent.type(screen.getByLabelText('Tags (comma-separated):'), 'phone, validation');
      
    //   // Click save
    //   const saveButton = screen.getByText('Save Pattern');
    //   await userEvent.click(saveButton);
      
    //   // Button should be disabled and show loading state
    //   await waitFor(() => {
    //     expect(saveButton).toBeDisabled();
    //     expect(saveButton).toHaveTextContent('Saving...');
    //   });
      
    //   // Wait for save to complete and check notification
    //   await waitFor(() => {
    //     expect(saveButton).not.toBeDisabled();
    //     expect(saveButton).toHaveTextContent('Save Pattern');
    //     expect(mockShowNotification).toHaveBeenCalledWith('Pattern saved successfully!', 'success');
    //   });
    // });

    // it('shows error when save fails', async () => {
    //   const errorMock = {
    //     request: {
    //       query: SAVE_REGEX_PATTERN,
    //       variables: {
    //         input: {
    //           name: 'Test Pattern',
    //           pattern: 'test',
    //           testString: '',
    //           tags: [],
    //           flags: {
    //             caseInsensitive: false,
    //             multiline: false,
    //             global: false
    //           }
    //         }
    //       }
    //     },
    //     error: new Error('Failed to save pattern')
    //   };

    //   render(
    //     <MockedProvider mocks={[errorMock]} addTypename={false}>
    //       <RegexTester />
    //     </MockedProvider>
    //   );
      
    //   // Fill in the pattern
    //   const patternInput = screen.getByLabelText('Pattern:');
    //   await userEvent.type(patternInput, 'test');

    //   // Fill in the name
    //   const nameInput = screen.getByLabelText('Pattern Name:');
    //   await userEvent.type(nameInput, 'Test Pattern');
      
    //   // Click save
    //   const saveButton = screen.getByText('Save Pattern');
    //   await userEvent.click(saveButton);
      
    //   // Wait for error message
    //   expect(await screen.findByText('Failed to save pattern')).toBeInTheDocument();
    // });
  });
}); 