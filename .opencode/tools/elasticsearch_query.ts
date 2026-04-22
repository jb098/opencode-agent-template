import { tool } from "@opencode-ai/plugin";
import { Client } from '@elastic/elasticsearch';

// Initialize your ES client
const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: { apiKey: process.env.ELASTICSEARCH_API_KEY || '' }
});

export default tool({
  description: "Search for documents in Elasticsearch by title or content.",
  // Use tool.schema (based on Zod) to define arguments for the agent
  args: {
    index: tool.schema.string().describe("The name of the index to search"),
    query: tool.schema.string().describe("The search term or keyword"),
    size: tool.schema.number().optional().describe("Number of results to return (default 10)")
  },
  async execute({ index, query, size }) {
    try {
      const response = await client.search({
        index: index,
        query: {
          multi_match: {
            query: query,
            fields: ['title', 'content']
          }
        },
        size: size || 10
      });

      // Return a string or serializable object for the agent's context
      const hits = response.hits.hits.map(hit => hit._source);
      return JSON.stringify(hits, null, 2);
    } catch (error: any) {
      return `Error performing search: ${error.message}`;
    }
  }
});
