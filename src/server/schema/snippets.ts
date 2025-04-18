export const snippetsTypeDefs = `#graphql
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
`; 