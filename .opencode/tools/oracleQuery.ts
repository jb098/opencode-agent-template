import oracledb from 'oracledb';
import { tool } from '@opencode-ai/plugin';

/**
 * Tool to execute SQL queries on an Oracle database.
 * Secrets are pulled from process.env for security.
 */
export const oracleQuery = tool({
  description: 'Executes a SQL query against the internal Oracle database and returns results as an array of objects.',
  args: {
    sql: tool.schema.string().describe('The SQL SELECT statement to execute.'),
    binds: tool.schema.record(tool.schema.any()).optional().describe('Optional bind variables for the query (e.g., { id: 101 }).'),
  },
  async execute({ sql, binds = {} }) {
    // Reading secrets from environment variables
    const dbConfig = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    };

    // Validation to ensure secrets are present
    if (!dbConfig.user || !dbConfig.password || !dbConfig.connectString) {
      throw new Error("Missing required database credentials in environment variables (DB_USER, DB_PASSWORD, DB_CONNECT_STRING).");
    }

    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      
      const result = await connection.execute(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });

      return result.rows || [];
    } catch (err: any) {
      return `Database Error: ${err.message}`;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  },
});

