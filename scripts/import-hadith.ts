import postgres from "postgres";
import { getScriptEnv } from "../lib/env";

const { DATABASE_URL } = getScriptEnv();
const sql = postgres(DATABASE_URL);

async function main() {
  const book = await sql`
    insert into hadith_books (slug, name_ar, name_en, source)
    values ('bukhari', 'صحيح البخاري', 'Sahih al-Bukhari', 'sunnah.com')
    on conflict (slug) do update set
      name_ar = excluded.name_ar,
      name_en = excluded.name_en,
      source = excluded.source,
      updated_at = now()
    returning id
  `;
  const id = book[0].id;

  await sql`
    insert into hadiths (book_id, hadith_number, text_ar, narrator_ar, grade_ar, chapter, ref)
    values (${id}, '1', 'إنما الأعمال بالنيات', 'عمر بن الخطاب', 'صحيح', 'بدء الوحي', 'bukhari:1')
    on conflict (book_id, hadith_number) do update set
      text_ar = excluded.text_ar,
      narrator_ar = excluded.narrator_ar,
      grade_ar = excluded.grade_ar,
      chapter = excluded.chapter,
      ref = excluded.ref,
      updated_at = now()
  `;

  await sql.end();
}

main().catch(error => {
  console.error("[import] failed:", error);
  process.exitCode = 1;
});
