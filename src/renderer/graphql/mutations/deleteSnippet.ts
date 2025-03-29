import { gql } from '@apollo/client';

export const DELETE_SNIPPET = gql`
  mutation DeleteSnippet($id: ID!) {
    deleteSnippet(id: $id)
  }
`; 