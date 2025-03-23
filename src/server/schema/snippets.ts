export const snippetsTypeDefs = `#graphql
  type Snippet {
    id: ID!
    title: String!
    code: String!
    language: String!
    description: String
    tags: [String!]!
    created_at: String!
    updated_at: String!
  }

  input CreateSnippetInput {
    title: String!
    code: String!
    language: String!
    description: String
    tags: [String!]
  }

  input UpdateSnippetInput {
    title: String
    code: String
    language: String
    description: String
    tags: [String!]
  }
`; 