import postgres from "postgres";
import { getScriptEnv } from "../lib/env";

const { DATABASE_URL } = getScriptEnv();
const sql = postgres(DATABASE_URL);

async function main() {
  const reciters = [
    {
      name_ar: "الحصري",
      name_en: "Al-Husary",
      code: "husary",
      style: "murattal",
      base_url_template: "https://everyayah.com/data/Husary_128kbps",
    },
    {
      name_ar: "المنشاوي",
      name_en: "Al-Minshawi",
      code: "minshawi",
      style: "murattal",
      base_url_template: "https://everyayah.com/data/Minshawy_Murattal_128kbps",
    },
  ];

  for (const reciter of reciters) {
    await sql`
      insert into quran_reciters (name_ar, name_en, code, style, base_url_template)
      values (${reciter.name_ar}, ${reciter.name_en}, ${reciter.code}, ${reciter.style}, ${reciter.base_url_template})
      on conflict (code) do update set
        name_ar = excluded.name_ar,
        name_en = excluded.name_en,
        style = excluded.style,
        base_url_template = excluded.base_url_template,
        updated_at = now()
    `;
  }

  await sql.end();
}

main().catch(error => {
  console.error("[import] failed:", error);
  process.exitCode = 1;
});
