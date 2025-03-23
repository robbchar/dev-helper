export const regexTypeDefs = `#graphql
  type RegexPattern {
    id: ID!
    pattern: String!
    name: String!
    description: String
    flags: String
    tags: [String!]!
    created_at: String!
    updated_at: String!
  }

  input CreateRegexPatternInput {
    pattern: String!
    name: String!
    description: String
    flags: String
    tags: [String!]
  }

  input UpdateRegexPatternInput {
    pattern: String
    name: String
    description: String
    flags: String
    tags: [String!]
  }
`; 