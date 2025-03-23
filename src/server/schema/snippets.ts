import { gql } from 'graphql-tag';

export const snippetTypeDefs = gql`
  type Snippet {
    id: ID!
    title: String!
    description: String
    code: String!
    language: String!
    tags: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    snippets: [Snippet!]!
    snippet(id: ID!): Snippet
  }

  extend type Mutation {
    createSnippet(
      title: String!
      description: String
      code: String!
      language: String!
      tags: [String!]!
    ): Snippet!
    
    updateSnippet(
      id: ID!
      title: String
      description: String
      code: String
      language: String
      tags: [String!]
    ): Snippet!
    
    deleteSnippet(id: ID!): Boolean!
  }
`; 