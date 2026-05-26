interface AIContext {
  locale?: 'ar' | 'en';
  source?: string;
}

export async function explainAyah(ayahText: string, context: AIContext = {}): Promise<string> {
  if (!ayahText.trim()) return 'No ayah text was provided.';
  return context.locale === 'ar'
    ? 'شرح مبدئي: سيتم إضافة تفسير موسع من مصادر موثوقة لاحقًا.'
    : 'Starter explanation: detailed tafsir integration will be added from trusted public sources.';
}

export async function explainHadith(hadithText: string, context: AIContext = {}): Promise<string> {
  if (!hadithText.trim()) return 'No hadith text was provided.';
  return context.locale === 'ar'
    ? 'شرح مبدئي: سيتم ربط شروح العلماء في تحديثات قادمة.'
    : 'Starter explanation: scholarly commentary linking is planned for future releases.';
}

export async function suggestDhikr(mood: string, context: AIContext = {}): Promise<string[]> {
  const normalized = mood.trim().toLowerCase();
  const defaults = ['SubhanAllah', 'Alhamdulillah', 'Allahu Akbar'];

  if (!normalized) return defaults;
  if (context.locale === 'ar') return ['سُبْحَانَ اللَّهِ', 'الْحَمْدُ لِلَّهِ', 'اللَّهُ أَكْبَرُ'];
  return defaults;
}

// Future AI expansion (free-only):
// - Retrieval-first architecture using local embeddings/open models.
// - Prompt helper modules for personalization and recommendation safety.
// - Search-index hooks for RAG over Quran/Hadith/Stories content.
