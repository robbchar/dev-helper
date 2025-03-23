import { snippetTypeDefs } from './snippets.js';
import { regexTypeDefs } from './regex.js';
import { gql } from 'graphql-tag';

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [baseTypeDefs, snippetTypeDefs, regexTypeDefs]; 