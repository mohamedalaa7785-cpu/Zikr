import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function main() {
  if (!supabaseUrl || !anonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
  }

  const tables = ['quran_surahs', 'quran_ayahs', 'hadith_books', 'hadiths'];

  for (const table of tables) {
    try {
      const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${table}?select=*&limit=1`;
      console.log(`Checking public read for table: ${table} at ${url}`);
      
      const response = await fetch(url, {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
      });

      console.log(`Response status for ${table}: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Successfully read from ${table}. Rows found: ${Array.isArray(data) ? data.length : 'unknown'}`);
      } else {
        const errorText = await response.text();
        console.error(`Read from ${table} failed:`, errorText);
      }
    } catch (error) {
      console.error(`Error checking ${table}:`, error);
    }
    console.log('---');
  }
}

main();
