import { gql } from '@apollo/client';

export const SAVE_REGEX_PATTERN = gql`
  mutation CreateRegexPattern($input: CreateRegexPatternInput!) {
    createRegexPattern(input: $input) {
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