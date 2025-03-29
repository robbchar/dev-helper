export const snippetTypeDefs = `#graphql
  type Snippet {
    id: ID!
    title: String!
    description: String
    code: String!
    language: String!
    tags: [String!]!
    created_at: String!
    updated_at: String!
  }

  input CreateSnippetInput {
    title: String!
    description: String
    code: String!
    language: String!
    tags: [String!]
  }

  input UpdateSnippetInput {
    title: String
    description: String
    code: String
    language: String
    tags: [String!]
  }

  type Query {
    snippets: [Snippet!]!
    snippet(id: ID!): Snippet
    searchSnippets(query: String!, tags: [String!]): [Snippet!]!
  }

  type Mutation {
    createSnippet(input: CreateSnippetInput!): Snippet!
    updateSnippet(id: ID!, input: UpdateSnippetInput!): Snippet!
    deleteSnippet(id: ID!): Boolean!
  }
`; 