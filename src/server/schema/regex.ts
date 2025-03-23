import { gql } from 'graphql-tag';

export const regexTypeDefs = gql`
  type RegexPattern {
    id: ID!
    pattern: String!
    name: String!
    description: String
    flags: String!
    tags: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    regexPatterns: [RegexPattern!]!
    regexPattern(id: ID!): RegexPattern
  }

  extend type Mutation {
    createRegexPattern(
      pattern: String!
      name: String!
      description: String
      flags: String!
      tags: [String!]!
    ): RegexPattern!
    
    updateRegexPattern(
      id: ID!
      pattern: String
      name: String
      description: String
      flags: String
      tags: [String!]
    ): RegexPattern!
    
    deleteRegexPattern(id: ID!): Boolean!
  }
`; 