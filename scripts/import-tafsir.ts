import postgres from 'postgres';
import { getScriptEnv } from '../lib/env';
const { DATABASE_URL } = getScriptEnv();
const sql = postgres(DATABASE_URL);
async function main(){const rows=[{surah_id:1,ayah_number:1,text:'ابتداء باسم الله',source:'التفسير الميسر'}];for (const r of rows){await sql`insert into quran_tafsir (surah_id,ayah_number,source,text) values (${r.surah_id},${r.ayah_number},${r.source},${r.text}) on conflict (surah_id,ayah_number,source) do update set text=excluded.text`; } await sql.end();}
main().catch((error) => {
  console.error('[import] failed:', error);
  process.exitCode = 1;
});
