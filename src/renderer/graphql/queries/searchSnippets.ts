import { gql } from '@apollo/client';

export const SEARCH_SNIPPETS = gql`
  query SearchSnippets($query: String!, $tags: [String!]) {
    searchSnippets(query: $query, tags: $tags) {
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