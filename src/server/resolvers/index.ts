import { snippetsResolvers } from './snippets.js';
import { regexResolvers } from './regex.js';

export const resolvers = {
  Query: {
    ...snippetsResolvers.Query,
    ...regexResolvers.Query,
  },
  Mutation: {
    ...snippetsResolvers.Mutation,
    ...regexResolvers.Mutation,
  }
}; 