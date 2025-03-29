import { gql } from '@apollo/client';

export const UPDATE_SNIPPET = gql`
  mutation UpdateSnippet($id: ID!, $input: UpdateSnippetInput!) {
    updateSnippet(id: $id, input: $input) {
      id
      title
      description
      code
      language
      tags
      created_at
      updated_at
    }
  }
`; 