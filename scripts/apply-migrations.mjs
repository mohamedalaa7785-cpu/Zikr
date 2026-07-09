import postgres from "postgres"
import { readFileSync, readdirSync } from "fs"
import { join } from "path"

const sql = postgres(process.env.POSTGRES_URL, { ssl: "require", max: 1 })

const dir = "supabase/migrations"
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .sort()

let ok = 0
let failed = 0

for (const file of files) {
  const content = readFileSync(join(dir, file), "utf8")
  try {
    await sql.unsafe(content)
    ok++
    console.log("OK   ", file)
  } catch (e) {
    failed++
    console.log("FAIL ", file, "->", e.message.slice(0, 200))
  }
}

console.log(`\nDone: ${ok} applied, ${failed} failed`)
await sql.end()
