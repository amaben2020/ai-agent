import { Pool, neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

// Create a pool for connection management
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

// Also create the neon sql function for simple queries
const sql = neon(process.env.DATABASE_URL!);

// Query function using connection pool
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get a client from the pool for transactions
export const getClient = async () => {
  return await pool.connect();
};

// Enable pgvector extension
export const enablePgVector = async () => {
  try {
    await query('CREATE EXTENSION IF NOT EXISTS vector');
    console.log('pgvector extension enabled');
  } catch (error) {
    console.error('Error enabling pgvector:', error);
    throw error;
  }
};

export { sql, pool };
export default pool;
