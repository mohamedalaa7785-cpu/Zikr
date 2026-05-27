import postgres from 'postgres';
import { getScriptEnv } from '../lib/env';
const { DATABASE_URL } = getScriptEnv();
const sql = postgres(DATABASE_URL);
async function main(){const reciters=[{name_ar:'الحصري',name_en:'Al-Husary',code:'husary',style:'murattal',base_url_template:'https://everyayah.com/data/Husary_128kbps'},{name_ar:'المنشاوي',name_en:'Al-Minshawi',code:'minshawi',style:'murattal',base_url_template:'https://everyayah.com/data/Minshawy_Murattal_128kbps'}];for(const r of reciters){await sql`insert into quran_reciters (name_ar,name_en,code,style,base_url_template) values (${r.name_ar},${r.name_en},${r.code},${r.style},${r.base_url_template}) on conflict (code) do update set name_ar=excluded.name_ar`; } await sql.end();}
main().catch((error) => {
  console.error('[import] failed:', error);
  process.exitCode = 1;
});
