import { gql } from '@apollo/client';

export const GET_REGEX_PATTERNS = gql`
  query GetRegexPatterns {
    regexPatterns {
      id
      name
      pattern
      testString
      tags
      flags {
        caseInsensitive
        multiline
        global
      }
      createdAt
      updatedAt
    }
  }
`; 