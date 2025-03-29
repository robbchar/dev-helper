import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Snippets from '../Snippets';
import { SnippetProvider } from '../../contexts/SnippetContext';
import { GET_SNIPPETS } from '../../graphql/queries/getSnippets';
import { CREATE_SNIPPET } from '../../graphql/mutations/createSnippet';
import { UPDATE_SNIPPET } from '../../graphql/mutations/updateSnippet';
import { DELETE_SNIPPET } from '../../graphql/mutations/deleteSnippet';
import { vi } from 'vitest';

const mockSnippets = [
  {
    id: '1',
    title: 'Test Snippet',
    description: 'Test Description',
    code: 'console.log("test")',
    language: 'javascript',
    tags: ['test', 'javascript'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Another Snippet',
    description: 'Another Description',
    code: 'print("test")',
    language: 'python',
    tags: ['test', 'python'],
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  }
];

const mocks = [
  {
    request: {
      query: GET_SNIPPETS
    },
    result: {
      data: {
        snippets: mockSnippets
      }
    },
    delay: 0
  },
  {
    request: {
      query: CREATE_SNIPPET,
      variables: {
        input: {
          title: 'New Snippet',
          description: 'New Description',
          code: 'test code',
          language: 'javascript',
          tags: ['new']
        }
      }
    },
    result: {
      data: {
        createSnippet: {
          id: '3',
          title: 'New Snippet',
          description: 'New Description',
          code: 'test code',
          language: 'javascript',
          tags: ['new'],
          created_at: '2024-01-03T00:00:00Z',
          updated_at: '2024-01-03T00:00:00Z'
        }
      }
    }
  },
  {
    request: {
      query: UPDATE_SNIPPET,
      variables: {
        id: '1',
        input: {
          title: 'Test Snippet',
          description: 'Updated Description',
          code: 'updated code',
          language: 'typescript',
          tags: ['test', 'javascript', 'updated']
        }
      }
    },
    result: {
      data: {
        updateSnippet: {
          id: '1',
          title: 'Test Snippet',
          description: 'Updated Description',
          code: 'updated code',
          language: 'typescript',
          tags: ['test', 'javascript', 'updated'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-03T00:00:00Z'
        }
      }
    }
  },
  {
    request: {
      query: DELETE_SNIPPET,
      variables: {
        id: '1'
      }
    },
    result: {
      data: {
        deleteSnippet: true
      }
    }
  }
];

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
    render(
      <MockedProvider mocks={mocks}>
        <SnippetProvider>
          <Snippets />
        </SnippetProvider>
      </MockedProvider>
    );
    expect(screen.getByText('Snippet Manager')).toBeInTheDocument();
  });

  it('loads and displays snippets in the load dialog', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SnippetProvider>
          <Snippets />
        </SnippetProvider>
      </MockedProvider>
    );

    // Open load dialog and wait for snippets
    fireEvent.click(screen.getByText('Load Snippet'));
    await waitFor(() => {
      expect(screen.getByText('Test Snippet')).toBeInTheDocument();
      expect(screen.getByText('Another Snippet')).toBeInTheDocument();
    });

    // Check if snippets are displayed with their details
    const testSnippet = screen.getByText('Test Snippet').closest('[class*="snippet"]');
    const anotherSnippet = screen.getByText('Another Snippet').closest('[class*="snippet"]');
    
    expect(testSnippet).toBeInTheDocument();
    expect(anotherSnippet).toBeInTheDocument();
    expect(testSnippet).toHaveTextContent('javascript');
    expect(testSnippet).toHaveTextContent('test');
    expect(anotherSnippet).toHaveTextContent('python');
  });

  it('filters snippets by language and tags', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SnippetProvider>
          <Snippets />
        </SnippetProvider>
      </MockedProvider>
    );

    // Open load dialog
    fireEvent.click(screen.getByText('Load Snippet'));

    // Wait for snippets to load
    await waitFor(() => {
      expect(screen.getByText('Test Snippet')).toBeInTheDocument();
    });

    // Find and click the language filter button
    const languagesSection = screen.getByTestId('languages-section');
    const languageButton = within(languagesSection).getByText('javascript');
    fireEvent.click(languageButton);
    
    // Check if only JavaScript snippet is visible
    expect(screen.getByText('Test Snippet')).toBeInTheDocument();
    expect(screen.queryByText('Another Snippet')).not.toBeInTheDocument();

    // Find and click the tag filter button
    const tagsSection = screen.getByTestId('tags-section');
    const tagButton = within(tagsSection).getByText('test');
    fireEvent.click(tagButton);

    // Check if filtered snippets are correct
    expect(screen.getByText('Test Snippet')).toBeInTheDocument();
  });

  it('creates a new snippet', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <SnippetProvider>
          <Snippets />
        </SnippetProvider>
      </MockedProvider>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Snippet' }
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New Description' }
    });
    fireEvent.change(screen.getByLabelText('Code'), {
      target: { value: 'test code' }
    });
    
    // Add a tag
    fireEvent.change(screen.getByPlaceholderText('Add a tag'), {
      target: { value: 'new' }
    });
    fireEvent.click(screen.getByText('Add'));

    // Submit the form
    fireEvent.click(screen.getByText('Create Snippet'));

    // Check if notification was shown
    await waitFor(() => {
      expect(window.showNotification).toHaveBeenCalledWith(
        'Snippet created successfully',
        'success'
      );
    });
  });

  it('updates an existing snippet', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SnippetProvider>
          <Snippets />
        </SnippetProvider>
      </MockedProvider>
    );

    // Open load dialog and wait for snippets
    fireEvent.click(screen.getByText('Load Snippet'));
    await waitFor(() => {
      expect(screen.getByText('Test Snippet')).toBeInTheDocument();
    });

    // Click the snippet and wait for it to load
    fireEvent.click(screen.getByText('Test Snippet'));
    
    // Wait for the form to be populated with the snippet data
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toHaveValue('Test Snippet');
      expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
      expect(screen.getByLabelText('Code')).toHaveValue('console.log("test")');
    });

    // Update form fields - do title last to prevent switching to create mode
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Updated Description' }
    });
    fireEvent.change(screen.getByLabelText('Code'), {
      target: { value: 'updated code' }
    });
    
    // Change language
    fireEvent.change(screen.getByLabelText('Language'), {
      target: { value: 'typescript' }
    });

    // Add new tag
    fireEvent.change(screen.getByPlaceholderText('Add a tag'), {
      target: { value: 'updated' }
    });
    fireEvent.click(screen.getByText('Add'));

    // Update title last to keep in update mode
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Snippet' }
    });

    // Submit the form
    fireEvent.click(screen.getByText('Update Snippet'));

    // Check if notification was shown
    await waitFor(() => {
      expect(window.showNotification).toHaveBeenCalledWith(
        'Snippet updated successfully',
        'success'
      );
    });
  });

  it('deletes a snippet', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <SnippetProvider>
          <Snippets />
        </SnippetProvider>
      </MockedProvider>
    );

    // Load a snippet first
    fireEvent.click(screen.getByText('Load Snippet'));
    await waitFor(() => {
      expect(screen.getByText('Test Snippet')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Test Snippet'));

    // Delete the snippet
    fireEvent.click(screen.getByText('Delete'));

    // Check if notification was shown
    await waitFor(() => {
      expect(window.showNotification).toHaveBeenCalledWith(
        'Snippet deleted successfully',
        'success'
      );
    });

    // Check if snippet was removed from the list
    fireEvent.click(screen.getByText('Load Snippet'));
    await waitFor(() => {
      expect(screen.queryByText('Test Snippet')).not.toBeInTheDocument();
    });
  });
}); 