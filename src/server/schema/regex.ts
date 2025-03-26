export const regexTypeDefs = `#graphql
  type RegexFlags {
    caseInsensitive: Boolean!
    multiline: Boolean!
    global: Boolean!
  }

  type RegexPattern {
    id: ID!
    name: String!
    pattern: String!
    testString: String
    flags: RegexFlags!
    tags: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  input RegexFlagsInput {
    caseInsensitive: Boolean!
    multiline: Boolean!
    global: Boolean!
  }

  input CreateRegexPatternInput {
    name: String!
    pattern: String!
    testString: String
    flags: RegexFlagsInput!
    tags: [String!]
  }

  input UpdateRegexPatternInput {
    name: String
    pattern: String
    testString: String
    flags: RegexFlagsInput
    tags: [String!]
  }
`; 