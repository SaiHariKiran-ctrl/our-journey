import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  try {
    const migrationPath = path.join(process.cwd(), 'src/lib/migrations/create_memories_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await sql`${sql.raw(migrationSQL)}`;
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 