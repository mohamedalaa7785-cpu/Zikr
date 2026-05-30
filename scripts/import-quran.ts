import postgres from "postgres";
import { getScriptEnv } from "../lib/env";

const { DATABASE_URL } = getScriptEnv();
const sql = postgres(DATABASE_URL);

async function main() {
  const data = await fetch(
    "https://api.alquran.cloud/v1/quran/quran-uthmani"
  ).then(response => response.json());

  for (const surah of data.data.surahs) {
    await sql`
      insert into quran_surahs (id, name_ar, name_en, name_translation, ayahs_count, revelation_place, "order", slug)
      values (
        ${surah.number},
        ${surah.name},
        ${surah.englishName},
        ${surah.englishNameTranslation},
        ${surah.numberOfAyahs},
        ${surah.revelationType.toLowerCase()},
        ${surah.number},
        ${surah.englishName.toLowerCase().replace(/\s+/g, "-")}
      )
      on conflict (id) do update set
        name_ar = excluded.name_ar,
        name_en = excluded.name_en,
        name_translation = excluded.name_translation,
        ayahs_count = excluded.ayahs_count,
        revelation_place = excluded.revelation_place,
        "order" = excluded."order",
        slug = excluded.slug,
        updated_at = now()
    `;

    for (const ayah of surah.ayahs) {
      await sql`
        insert into quran_ayahs (surah_id, ayah_number, text_ar, text_uthmani, text_simple, page, juz, hizb, rub, sajda)
        values (
          ${surah.number},
          ${ayah.numberInSurah},
          ${ayah.text},
          ${ayah.text},
          ${ayah.text},
          ${ayah.page},
          ${ayah.juz},
          ${ayah.hizbQuarter},
          ${ayah.hizbQuarter},
          ${Boolean(ayah.sajda)}
        )
        on conflict (surah_id, ayah_number) do update set
          text_ar = excluded.text_ar,
          text_uthmani = excluded.text_uthmani,
          text_simple = excluded.text_simple,
          page = excluded.page,
          juz = excluded.juz,
          hizb = excluded.hizb,
          rub = excluded.rub,
          sajda = excluded.sajda,
          updated_at = now()
      `;
    }
  }

  await sql.end();
}

main().catch(error => {
  console.error("[import] failed:", error);
  process.exitCode = 1;
});
