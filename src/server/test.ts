import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/index.js';
import { resolvers } from './resolvers/index.js';
import { initDatabase } from './db/index.js';

async function testServer() {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Initialize database
  await initDatabase();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server);
  console.log(`🚀 Server ready at ${url}`);

  try {
    // Test creating a snippet
    const createSnippetResult = await server.executeOperation({
      query: `
        mutation CreateSnippet {
          createSnippet(
            title: "Test Snippet"
            description: "A test snippet"
            code: "console.log('Hello World')"
            language: "javascript"
            tags: ["test", "example"]
          ) {
            id
            title
            description
            code
            language
            tags
          }
        }
      `
    });
    console.log('Create Snippet Result:', createSnippetResult);

    // Test querying snippets
    const querySnippetsResult = await server.executeOperation({
      query: `
        query GetSnippets {
          snippets {
            id
            title
            description
            code
            language
            tags
          }
        }
      `
    });
    console.log('Query Snippets Result:', querySnippetsResult);

    // Test creating a regex pattern
    const createRegexResult = await server.executeOperation({
      query: `
        mutation CreateRegex {
          createRegexPattern(
            pattern: "\\d+"
            name: "Numbers"
            description: "Matches one or more digits"
            flags: "g"
            tags: ["test", "numbers"]
          ) {
            id
            pattern
            name
            description
            flags
            tags
          }
        }
      `
    });
    console.log('Create Regex Result:', createRegexResult);

    // Test querying regex patterns
    const queryRegexResult = await server.executeOperation({
      query: `
        query GetRegexPatterns {
          regexPatterns {
            id
            pattern
            name
            description
            flags
            tags
          }
        }
      `
    });
    console.log('Query Regex Patterns Result:', queryRegexResult);

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await server.stop();
  }
}

testServer().catch(console.error); 