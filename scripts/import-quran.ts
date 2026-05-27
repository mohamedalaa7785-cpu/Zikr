import postgres from 'postgres';
import { getScriptEnv } from '../lib/env';
const { DATABASE_URL } = getScriptEnv();
const sql = postgres(DATABASE_URL);
async function main(){const data=await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani').then(r=>r.json());for (const s of data.data.surahs){await sql`insert into quran_surahs (id,name_ar,name_en,ayah_count,revelation_place,"order",slug) values (${s.number},${s.name},${s.englishName},${s.numberOfAyahs},${s.revelationType.toLowerCase()},${s.number},${s.englishName.toLowerCase().replace(/\s+/g,'-')}) on conflict (id) do update set name_ar=excluded.name_ar`;for(const a of s.ayahs){await sql`insert into quran_ayahs (surah_id,ayah_number,text_uthmani,text_simple,page,juz,hizb,rub,sajda) values (${s.number},${a.numberInSurah},${a.text},${a.text},${a.page},${a.juz},${a.hizbQuarter},${a.hizbQuarter},false) on conflict (surah_id,ayah_number) do update set text_uthmani=excluded.text_uthmani`;}}
await sql.end();}
main().catch((error) => {
  console.error('[import] failed:', error);
  process.exitCode = 1;
});
