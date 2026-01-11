import { readFileSync } from 'fs';
import { join } from 'path';
import pool from '../../db';

export async function runMigrations() {
  try {
    console.log('Running database migrations...');

    // Read the schema SQL file
    const schemaPath = join(__dirname, 'schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf-8');

    // Execute the schema
    await pool.query(schemaSql);

    console.log('✅ Database migrations completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    throw error;
  }
}

// Allow running migrations directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migrations completed. Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration error:', error);
      process.exit(1);
    });
}
