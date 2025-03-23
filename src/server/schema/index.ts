import { snippetsTypeDefs } from './snippets.js';
import { regexTypeDefs } from './regex.js';

export const typeDefs = `#graphql
  ${snippetsTypeDefs}
  ${regexTypeDefs}

  type Query {
    snippets: [Snippet!]!
    snippet(id: ID!): Snippet
    regexPatterns: [RegexPattern!]!
    regexPattern(id: ID!): RegexPattern
  }

  type Mutation {
    createSnippet(input: CreateSnippetInput!): Snippet!
    updateSnippet(id: ID!, input: UpdateSnippetInput!): Snippet!
    deleteSnippet(id: ID!): Boolean!
    createRegexPattern(input: CreateRegexPatternInput!): RegexPattern!
    updateRegexPattern(id: ID!, input: UpdateRegexPatternInput!): RegexPattern!
    deleteRegexPattern(id: ID!): Boolean!
  }
`; 