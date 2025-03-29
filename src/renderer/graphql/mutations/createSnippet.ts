import { gql } from '@apollo/client';

export const CREATE_SNIPPET = gql`
  mutation CreateSnippet($input: CreateSnippetInput!) {
    createSnippet(input: $input) {
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