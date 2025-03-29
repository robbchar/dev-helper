import React from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_SNIPPET } from '../graphql/mutations/createSnippet';
import { UPDATE_SNIPPET } from '../graphql/mutations/updateSnippet';
import { DELETE_SNIPPET } from '../graphql/mutations/deleteSnippet';
import type { Snippet, CreateSnippetInput, UpdateSnippetInput } from '../types/Snippet';
import pageStyles from './Page.module.css';
import SnippetEditor from '../components/SnippetEditor';
import Modal from '../components/Modal';
import SavedSnippetsList from '../components/SavedSnippetsList';
import type { NotificationType } from '../components/Notification/Notification';
import { useSnippet } from '../contexts/SnippetContext';
import { GET_SNIPPETS } from '../graphql/queries/getSnippets';

declare global {
  interface Window {
    showNotification: (message: string, type: NotificationType, persistent?: boolean) => void;
  }
}

interface DeleteSnippetResponse {
  deleteSnippet: boolean;
}

interface UpdateSnippetResponse {
  updateSnippet: Snippet;
}

interface CreateSnippetResponse {
  createSnippet: Snippet;
}

interface SnippetsQueryResult {
  snippets: Snippet[];
}

const Snippets: React.FC = () => {
  const { selectedSnippet, setSelectedSnippet } = useSnippet();
  const [isLoadModalOpen, setIsLoadModalOpen] = React.useState(false);

  // Create snippet mutation
  const [createSnippet, { loading: creating }] = useMutation<CreateSnippetResponse>(CREATE_SNIPPET, {
    onCompleted: (data) => {
      window.showNotification('Snippet created successfully', 'success');
      setSelectedSnippet(data.createSnippet);
    },
    update: (cache, { data }) => {
      if (!data?.createSnippet) return;

      // Read the current snippets from the cache
      const existingData = cache.readQuery<SnippetsQueryResult>({
        query: GET_SNIPPETS
      });

      // Write back to the cache with the new snippet added
      cache.writeQuery({
        query: GET_SNIPPETS,
        data: {
          snippets: existingData ? [...existingData.snippets, data.createSnippet] : [data.createSnippet]
        }
      });
    }
  });

  // Update snippet mutation
  const [updateSnippet, { loading: updating }] = useMutation<UpdateSnippetResponse>(UPDATE_SNIPPET, {
    onCompleted: (data) => {
      window.showNotification('Snippet updated successfully', 'success');
      setSelectedSnippet(data.updateSnippet);
    }
  });

  // Delete snippet mutation
  const [deleteSnippet, { loading: deleting }] = useMutation<DeleteSnippetResponse>(DELETE_SNIPPET, {
    onCompleted: (data) => {
      if (data.deleteSnippet) {
        window.showNotification('Snippet deleted successfully', 'success');
        setSelectedSnippet(null);
      }
    },
    update: (cache, { data }) => {
      if (!data?.deleteSnippet) return;

      // Read the current snippets from the cache
      const existingData = cache.readQuery<SnippetsQueryResult>({
        query: GET_SNIPPETS
      });

      if (!existingData) return;

      // Write back to the cache with the deleted snippet removed
      cache.writeQuery({
        query: GET_SNIPPETS,
        data: {
          snippets: existingData.snippets.filter(
            snippet => snippet.id !== selectedSnippet?.id
          )
        }
      });
    }
  });

  const handleCreate = async (input: CreateSnippetInput) => {
    try {
      await createSnippet({ variables: { input } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while creating the snippet';
      window.showNotification(errorMessage, 'error', true);
      console.error('Error creating snippet:', error);
    }
  };

  const handleUpdate = async (input: UpdateSnippetInput) => {
    if (!selectedSnippet) return;
    try {
      await updateSnippet({
        variables: {
          id: selectedSnippet.id,
          input: {
            title: input.title,
            description: input.description,
            code: input.code,
            language: input.language,
            tags: input.tags
          }
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while updating the snippet';
      window.showNotification(errorMessage, 'error', true);
      console.error('Error updating snippet:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedSnippet) return;
    try {
      await deleteSnippet({ variables: { id: selectedSnippet.id } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while deleting the snippet';
      window.showNotification(errorMessage, 'error', true);
      console.error('Error deleting snippet:', error);
    }
  };

  const handleLoadSnippet = (loadedSnippet: Snippet) => {
    setSelectedSnippet(loadedSnippet);
    setIsLoadModalOpen(false);
  };

  return (
    <div className={pageStyles.container}>
      <div className={pageStyles.header}>
        <h1>Snippet Manager</h1>
        <button 
          onClick={() => setIsLoadModalOpen(true)}
          className={pageStyles.loadButton}
        >
          Load Snippet
        </button>
      </div>

      <div className={pageStyles.content}>
        <SnippetEditor
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          loading={creating || updating || deleting}
        />
      </div>

      <Modal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        title="Load Saved Snippet"
      >
        <SavedSnippetsList onSelect={handleLoadSnippet} />
      </Modal>
    </div>
  );
};

export default Snippets; 