import postgres from "postgres";
import { getScriptEnv } from "../lib/env";

const { DATABASE_URL } = getScriptEnv();
const sql = postgres(DATABASE_URL);

async function main() {
  const rows = [
    {
      surah_id: 1,
      ayah_number: 1,
      text: "ابتداء باسم الله",
      source: "التفسير الميسر",
    },
  ];

  for (const row of rows) {
    await sql`
      insert into quran_tafsir (surah_id, ayah_number, author, tafsir_ar)
      values (${row.surah_id}, ${row.ayah_number}, ${row.source}, ${row.text})
      on conflict (surah_id, ayah_number, author) do update set
        tafsir_ar = excluded.tafsir_ar,
        updated_at = now()
    `;
  }

  await sql.end();
}

main().catch(error => {
  console.error("[import] failed:", error);
  process.exitCode = 1;
});
