'use server';

/**
 * @openapi
 * POST /memorization/evaluate (Server Action: evaluateMemorizationAction)
 *
 * Summary: Evaluate Quran recitation via AI
 * Description: Uses Google Gemini to evaluate a Quran recitation recording. Returns feedback on memorization quality, tajweed rules, overall score (0-100), and review advice in Arabic.
 * Tags: AI, Memorization
 * Auth: None
 *
 * Request (FormData):
 *   - target: string (optional) - Target passage reference
 *   - expectedText: string (optional) - Expected Quran text
 *   - audio: File (optional) - Audio recording (webm/wav)
 *
 * Response:
 *   - string: AI-generated evaluation in Arabic
 */
import { generateGeminiFromAudio, generateGeminiText } from '@/lib/services/gemini-client';

export async function evaluateMemorizationAction(formData: FormData) {
  const target = String(formData.get('target') ?? '').trim();
  const expectedText = String(formData.get('expectedText') ?? '').trim();
  const audio = formData.get('audio');

  const prompt = `أنت مصحح قرآني خبير. قيّم تسميع القرآن التالي باحترام وبالعربية. 
  يجب أن يكون التقييم مفصلاً ويشمل:
  1. جودة الحفظ: (ذكر مواضع الخطأ أو التردد إن وجدت).
  2. أحكام التجويد: (مخارج الحروف، المدود، الغنة، والقلقلة).
  3. التقييم العام: درجة من 100.
  4. نصيحة للمراجعة: خطة قصيرة لتثبيت هذا الورد.
  
  المقرر: ${target || 'غير محدد'}. 
  النص المتوقع/سؤال أكمل: ${expectedText || 'غير محدد'}. 
  إذا كان الصوت غير واضح أو فارغ، أخبر المستخدم بذلك بأدب.`;

  if (audio instanceof File && audio.size > 0) {
    const bytes = Buffer.from(await audio.arrayBuffer()).toString('base64');
    const response = await generateGeminiFromAudio(prompt, { data: bytes, mimeType: audio.type || 'audio/webm' });
    if (response) return response;
  }

  const fallbackPrompt = `${prompt}\nلا يوجد ملف صوت قابل للتحليل. قدم نموذج تقييم وخطوات متابعة للمستخدم.`;
  return await generateGeminiText(fallbackPrompt) ?? 'لم يتم إعداد مفتاح الذكاء الاصطناعي بعد. سجّل التسميع ثم فعّل GEMINI_API_KEY للحصول على تقييم الحفظ والتجويد.';
}

// ---------------------------------------------------------------------------
// Memorization progress tracking (per-user, stored in Supabase)
// ---------------------------------------------------------------------------

export interface MemorizationEntry {
  id: string;
  surah_number: number;
  surah_name: string;
  total_ayahs: number;
  memorized_ayahs: number;
  last_reviewed_at: string | null;
}

export async function getMemorizationProgress(): Promise<{ entries: MemorizationEntry[]; loggedIn: boolean }> {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { entries: [], loggedIn: false };

    const { data } = await supabase
      .from('memorization_progress')
      .select('id, surah_number, surah_name, total_ayahs, memorized_ayahs, last_reviewed_at')
      .eq('user_id', user.id)
      .order('surah_number', { ascending: true });

    return { entries: (data as MemorizationEntry[]) ?? [], loggedIn: true };
  } catch {
    return { entries: [], loggedIn: false };
  }
}

export async function upsertMemorizationProgress(input: {
  surahNumber: number;
  surahName: string;
  totalAyahs: number;
  memorizedAyahs: number;
}): Promise<{ ok: boolean; error?: string }> {
  const { surahNumber, surahName, totalAyahs, memorizedAyahs } = input;
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return { ok: false, error: 'رقم سورة غير صالح' };
  }
  if (!Number.isInteger(memorizedAyahs) || memorizedAyahs < 0 || memorizedAyahs > totalAyahs) {
    return { ok: false, error: 'عدد آيات غير صالح' };
  }
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'يجب تسجيل الدخول لحفظ تقدمك' };

    const { error } = await supabase
      .from('memorization_progress')
      .upsert(
        {
          user_id: user.id,
          surah_number: surahNumber,
          surah_name: surahName,
          total_ayahs: totalAyahs,
          memorized_ayahs: memorizedAyahs,
          last_reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,surah_number' },
      );

    if (error) return { ok: false, error: 'تعذر حفظ التقدم. تأكد من تشغيل آخر migration.' };
    return { ok: true };
  } catch {
    return { ok: false, error: 'حدث خطأ غير متوقع' };
  }
}

export async function deleteMemorizationProgress(surahNumber: number): Promise<{ ok: boolean }> {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    await supabase
      .from('memorization_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('surah_number', surahNumber);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
