import { gql } from '@apollo/client';

export const GET_SNIPPETS = gql`
  query GetSnippets {
    snippets {
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