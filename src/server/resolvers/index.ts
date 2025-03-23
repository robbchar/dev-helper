import { snippetResolvers } from './snippets.js';
import { regexResolvers } from './regex.js';

export const resolvers = {
  Query: {
    ...snippetResolvers.Query,
    ...regexResolvers.Query,
  },
  Mutation: {
    ...snippetResolvers.Mutation,
    ...regexResolvers.Mutation,
  }
}; 