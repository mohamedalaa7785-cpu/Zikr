export interface AIExplanation {
  summary: string;
  references: string[];
  source: "local-fallback";
}

export async function explainAyah(ayahRef: string): Promise<AIExplanation> {
  return {
    summary: `Explanation placeholder for ayah ${ayahRef}. This uses safe local fallback content only.`,
    references: ["quran", "tafsir-placeholder"],
    source: "local-fallback",
  };
}

export async function explainHadith(hadithRef: string): Promise<AIExplanation> {
  return {
    summary: `Explanation placeholder for hadith ${hadithRef}. Future RAG can enrich this safely.`,
    references: ["hadith", "sharh-placeholder"],
    source: "local-fallback",
  };
}

export async function suggestDhikr(context?: string): Promise<AIExplanation> {
  return {
    summary: context
      ? `Suggested dhikr for context: ${context}. SubhanAllah, Alhamdulillah, Allahu Akbar.`
      : "Suggested dhikr: SubhanAllah, Alhamdulillah, Allahu Akbar.",
    references: ["adhkar-placeholder"],
    source: "local-fallback",
  };
}
// Future AI expansion: local embeddings + retrieval, no paid API dependency.
