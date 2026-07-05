import { generateText, streamText } from 'ai';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, type GenerationConfig } from '@google/generative-ai';

/**
 * Text generation client.
 *
 * Preference order:
 *   1. Vercel AI Gateway (zero-config for Google models when AI_GATEWAY_API_KEY
 *      or Vercel OIDC is present). This is the default and most reliable path.
 *   2. Direct Google Generative AI SDK, only if a valid GEMINI_API_KEY is set.
 *
 * All functions return `null` (or yield nothing) on failure so callers can fall
 * back to their own static content gracefully.
 */

// Gateway model id. GEMINI_MODEL may hold a bare id like "gemini-2.5-flash";
// normalize it to the "google/..." form the gateway expects.
function getGatewayModelId(): string {
  const raw = (process.env.GEMINI_MODEL ?? 'gemini-2.5-flash').trim();
  if (raw.includes('/')) return raw;
  // Map legacy/unsupported ids to a current gateway model.
  if (raw.startsWith('gemini-1.5')) return 'google/gemini-2.5-flash';
  return `google/${raw}`;
}

function gatewayAvailable(): boolean {
  return Boolean(
    (process.env.AI_GATEWAY_API_KEY && process.env.AI_GATEWAY_API_KEY.trim()) ||
      (process.env.VERCEL_OIDC_TOKEN && process.env.VERCEL_OIDC_TOKEN.trim())
  );
}

// ── Direct Google SDK (fallback) ────────────────────────────────────────────
const DIRECT_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
let cachedClient: GoogleGenerativeAI | null = null;

function getDirectApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || !key.trim()) return null;
  return key;
}

function getDirectClient(): GoogleGenerativeAI | null {
  const key = getDirectApiKey();
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

const directGenerationConfig: GenerationConfig = {
  temperature: 0.4,
  topP: 0.9,
  topK: 32,
  maxOutputTokens: 1000,
};

// ── Public API ────────────────────────────────────────────────────────────
export async function generateGeminiText(prompt: string): Promise<string | null> {
  // 1. Prefer the AI Gateway.
  if (gatewayAvailable()) {
    try {
      const { text } = await generateText({
        model: getGatewayModelId(),
        prompt,
        temperature: 0.4,
        maxOutputTokens: 1000,
      });
      const trimmed = text.trim();
      if (trimmed) return trimmed;
    } catch (error) {
      console.error('[ai-service] Gateway generation failed, trying direct SDK:', error);
    }
  }

  // 2. Fall back to the direct Google SDK if a valid key exists.
  const client = getDirectClient();
  if (!client) return null;

  try {
    const model = client.getGenerativeModel({ model: DIRECT_MODEL, safetySettings, generationConfig: directGenerationConfig });
    const result = await model.generateContent(prompt);
    return result.response.text().trim() || null;
  } catch (error) {
    console.error('[ai-service] Direct SDK generation failed:', error);
    return null;
  }
}

export async function* streamGeminiText(prompt: string): AsyncGenerator<string, void, unknown> {
  // 1. Prefer the AI Gateway.
  if (gatewayAvailable()) {
    try {
      const result = streamText({
        model: getGatewayModelId(),
        prompt,
        temperature: 0.4,
        maxOutputTokens: 1000,
      });
      for await (const chunk of result.textStream) {
        if (chunk) yield chunk;
      }
      return;
    } catch (error) {
      console.error('[ai-service] Gateway streaming failed, trying direct SDK:', error);
    }
  }

  // 2. Fall back to the direct Google SDK.
  const client = getDirectClient();
  if (!client) return;

  try {
    const model = client.getGenerativeModel({ model: DIRECT_MODEL, safetySettings, generationConfig: directGenerationConfig });
    const streamResult = await model.generateContentStream(prompt);
    for await (const chunk of streamResult.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  } catch (error) {
    console.error('[ai-service] Direct SDK streaming failed:', error);
  }
}

export async function generateGeminiFromAudio(prompt: string, audio: { data: string; mimeType: string }): Promise<string | null> {
  // Audio transcription requires the direct Google SDK (inline audio data).
  const client = getDirectClient();
  if (!client) return null;

  try {
    const model = client.getGenerativeModel({ model: DIRECT_MODEL, safetySettings, generationConfig: directGenerationConfig });
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: audio.data, mimeType: audio.mimeType } },
    ] as never);
    return result.response.text().trim() || null;
  } catch (error) {
    console.error('[ai-service] Failed to generate text from audio:', error);
    return null;
  }
}
