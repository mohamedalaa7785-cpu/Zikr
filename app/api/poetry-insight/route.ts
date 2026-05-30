import { generateGeminiText } from '@/lib/services/gemini-client';

export async function POST(request: Request) {
  try {
    const { poem, title } = await request.json();

    if (!poem || !title) {
      return Response.json(
        { error: 'Missing poem or title' },
        { status: 400 }
      );
    }

    const prompt = `أنت متخصص في النقد الأدبي والشعر الإسلامي. 
قصيدة بعنوان: "${title}"
النص: "${poem}"

قدم تحليلاً قصيراً (3-4 أسطر فقط) للقصيدة يتضمن:
1. الفكرة الرئيسية
2. الأسلوب والجمال الأدبي
3. الرسالة الروحانية أو الأخلاقية

الرد يجب أن يكون باللغة العربية الفصحى وبسيط وجميل.`;

    const insight = await generateGeminiText(prompt);

    if (!insight) {
      return Response.json(
        { error: 'Failed to generate insight' },
        { status: 500 }
      );
    }

    return Response.json({ insight });
  } catch (error) {
    console.error('[poetry-insight] Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
