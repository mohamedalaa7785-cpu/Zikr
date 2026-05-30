'use server';

import { generateGeminiFromAudio, generateGeminiText } from '@/lib/services/gemini-client';

export async function evaluateMemorizationAction(formData: FormData) {
  const target = String(formData.get('target') ?? '').trim();
  const expectedText = String(formData.get('expectedText') ?? '').trim();
  const audio = formData.get('audio');

  const prompt = `قيّم تسميع القرآن التالي باحترام وبالعربية. ركّز على: الحفظ، مواضع التردد، التجويد، مخارج الحروف، المدود، والغنة. أعط درجة من 100 وخطة مراجعة قصيرة. المقرر: ${target || 'غير محدد'}. النص المتوقع/سؤال أكمل: ${expectedText || 'غير محدد'}. إذا كان الصوت غير واضح قل ذلك بوضوح.`;

  if (audio instanceof File && audio.size > 0) {
    const bytes = Buffer.from(await audio.arrayBuffer()).toString('base64');
    const response = await generateGeminiFromAudio(prompt, { data: bytes, mimeType: audio.type || 'audio/webm' });
    if (response) return response;
  }

  const fallbackPrompt = `${prompt}\nلا يوجد ملف صوت قابل للتحليل. قدم نموذج تقييم وخطوات متابعة للمستخدم.`;
  return await generateGeminiText(fallbackPrompt) ?? 'لم يتم إعداد مفتاح الذكاء الاصطناعي بعد. سجّل التسميع ثم فعّل GEMINI_API_KEY للحصول على تقييم الحفظ والتجويد.';
}
