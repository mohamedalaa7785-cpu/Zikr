import postgres from "postgres";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString!, {
  ssl: "require",
  max: 1,
});

async function applyMigrations() {
  const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql")).sort();

  console.log(`Found ${files.length} migration files.`);

  for (const file of files) {
    console.log(`Applying migration: ${file}`);
    const filePath = path.join(migrationsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    
    // Split by --> statement-breakpoint if exists, or just run as one
    const statements = content.split("--> statement-breakpoint");
    
    try {
      await sql.begin(async (tx) => {
        for (const statement of statements) {
          const trimmed = statement.trim();
          if (trimmed) {
            await tx.unsafe(trimmed);
          }
        }
      });
      console.log(`Successfully applied ${file}`);
    } catch (error) {
      console.error(`Failed to apply ${file}:`, error);
      // Continue to next file if it's "already exists" error, otherwise might need to stop
      if (error instanceof Error && (error.message.includes("already exists") || error.message.includes("already a member"))) {
        console.log("Skipping due to existing relation/type.");
        continue;
      }
      // process.exit(1);
    }
  }

  console.log("Migration process finished.");
  await sql.end();
}

applyMigrations();
