import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  try {
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Tables in public schema:');
    result.forEach(row => console.log(`- ${row.table_name}`));
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}

main();
