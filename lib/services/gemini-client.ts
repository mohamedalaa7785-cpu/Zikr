import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, type GenerationConfig } from '@google/generative-ai';

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash';

let cachedClient: GoogleGenerativeAI | null = null;

function getApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || !key.trim()) return null;
  return key;
}

function getClient(): GoogleGenerativeAI | null {
  const key = getApiKey();
  if (!key) return null;
  if (!cachedClient) cachedClient = new GoogleGenerativeAI(key);
  return cachedClient;
}

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const freeTierGenerationConfig: GenerationConfig = {
  temperature: 0.4,
  topP: 0.9,
  topK: 32,
  maxOutputTokens: 400,
};

export async function generateGeminiText(prompt: string): Promise<string | null> {
  const client = getClient();
  if (!client) return null;

  const model = client.getGenerativeModel({ model: GEMINI_MODEL, safetySettings, generationConfig: freeTierGenerationConfig });
  const result = await model.generateContent(prompt);
  return result.response.text().trim() || null;
}

export async function* streamGeminiText(prompt: string): AsyncGenerator<string, void, unknown> {
  const client = getClient();
  if (!client) return;

  const model = client.getGenerativeModel({ model: GEMINI_MODEL, safetySettings, generationConfig: freeTierGenerationConfig });
  const streamResult = await model.generateContentStream(prompt);

  for await (const chunk of streamResult.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}
