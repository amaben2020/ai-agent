import express from 'express';
import { enablePgVector, query } from '../db';
import chatRouter from "./routes/chat"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test database connection
app.get('/db-test', async (_, res) => {
  try {
    const result = await query('SELECT NOW() as current_time');
    res.json({
      success: true,
      message: 'Database connected successfully',
      data: result.rows
    });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post("/chat", chatRouter)
// Initialize pgvector extension
const initializeDatabase = async () => {
  try {
    await enablePgVector();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Initialize database on startup
  await initializeDatabase();
});
