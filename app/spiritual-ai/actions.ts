'use server';

import { generateGeminiText } from '@/lib/services/gemini-client';
import { searchQuran } from '@/lib/services/quran';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: 'fatwa' | 'spiritual' | 'dhikr' | 'general';
  verses?: { text: string; reference: string }[];
  dhikr?: string[];
}

export interface ChatResult {
  message: string;
  type: 'fatwa' | 'spiritual' | 'dhikr' | 'general';
  verses?: { text: string; reference: string }[];
  dhikr?: string[];
  error?: string;
}

// ── Detect what kind of question was asked ───────────────────────────────────
function classifyQuestion(text: string): 'fatwa' | 'spiritual' | 'dhikr' | 'general' {
  const t = text;

  const fatwaKeywords = [
    'حلال', 'حرام', 'جائز', 'يجوز', 'لا يجوز', 'مباح', 'مكروه', 'فرض', 'واجب',
    'فتوى', 'حكم', 'شرعي', 'إسلام يقول', 'ما حكم', 'هل يجوز', 'هل يحل',
    'هل حرام', 'هل حلال', 'الصلاة', 'الزكاة', 'الصيام', 'الحج', 'الربا',
    'الطلاق', 'الميراث', 'النكاح', 'الزواج الشرعي', 'المهر', 'العدة',
  ];

  const dhikrKeywords = [
    'ذكر', 'دعاء', 'أذكار', 'تسبيح', 'استغفار', 'صلاة على النبي',
    'ذكر الصباح', 'ذكر المساء', 'دعاء النوم', 'دعاء الاستيقاظ',
  ];

  const spiritualKeywords = [
    'حزين', 'قلق', 'خائف', 'وحيد', 'مكتئب', 'تعبان', 'أشعر', 'أحتاج',
    'ابتلاء', 'صبر', 'ذنب', 'توبة', 'مرض', 'وفاة', 'رزق', 'ضيق',
    'واسيني', 'ادعيلي', 'أنا خايف', 'أنا زعلان',
  ];

  if (fatwaKeywords.some((k) => t.includes(k))) return 'fatwa';
  if (dhikrKeywords.some((k) => t.includes(k))) return 'dhikr';
  if (spiritualKeywords.some((k) => t.includes(k))) return 'spiritual';
  return 'general';
}

// ── Detect emotion for dhikr suggestions ─────────────────────────────────────
function detectEmotion(text: string): string {
  const map: Record<string, string[]> = {
    حزن: ['حزين', 'حزن', 'مكتئب', 'ضيق', 'فقدان', 'وحيد', 'يأس', 'محبط', 'تعبان'],
    قلق: ['قلق', 'توتر', 'متوتر', 'مرتبك', 'وسواس', 'أرق', 'خايف من المستقبل'],
    فرح: ['سعيد', 'فرحان', 'مبسوط', 'نجحت', 'اتخطبت', 'اتجوزت'],
    خوف: ['خوف', 'خائف', 'رعب', 'فزع', 'خايف'],
    غضب: ['غاضب', 'غضب', 'عصبي', 'زعلان', 'ظلمني'],
    شكر: ['شاكر', 'ممتن', 'الحمد لله'],
    صبر: ['ابتلاء', 'محنة', 'بلاء', 'مرض', 'مريض', 'وفاة', 'مات'],
    ذنب: ['ذنب', 'معصية', 'توبة', 'أتوب', 'ندم', 'غلطت'],
    رزق: ['رزق', 'فلوس', 'دين', 'ديون', 'عاطل', 'فقر'],
    زواج: ['زواج', 'عنوسة', 'نصيب', 'طلاق', 'انفصال'],
  };
  for (const [emotion, keywords] of Object.entries(map)) {
    if (keywords.some((k) => text.includes(k))) return emotion;
  }
  return 'عام';
}

const DHIKR_MAP: Record<string, string[]> = {
  حزن: ['لا حول ولا قوة إلا بالله', 'حسبي الله ونعم الوكيل', 'إنا لله وإنا إليه راجعون'],
  قلق: ['حسبي الله لا إله إلا هو عليه توكلت', 'يا حي يا قيوم برحمتك أستغيث', 'اللهم إني أعوذ بك من الهم والحزن'],
  فرح: ['الحمد لله رب العالمين', 'سبحان الله وبحمده', 'اللهم لك الحمد كما ينبغي لجلال وجهك'],
  خوف: ['حسبنا الله ونعم الوكيل', 'بسم الله الذي لا يضر مع اسمه شيء', 'أعوذ بكلمات الله التامات من شر ما خلق'],
  غضب: ['أعوذ بالله من الشيطان الرجيم', 'اللهم اغفر لي وارحمني', 'لا إله إلا أنت سبحانك إني كنت من الظالمين'],
  شكر: ['الحمد لله الذي بنعمته تتم الصالحات', 'اللهم لك الحمد كما ينبغي لجلال وجهك', 'سبحان الله وبحمده سبحان الله العظيم'],
  صبر: ['إنا لله وإنا إليه راجعون', 'اللهم أجرني في مصيبتي واخلف لي خيرا منها', 'لا حول ولا قوة إلا بالله العلي العظيم'],
  ذنب: ['أستغفر الله العظيم وأتوب إليه', 'سبحانك اللهم وبحمدك أشهد أن لا إله إلا أنت أستغفرك وأتوب إليك', 'رب اغفر لي وتب علي إنك أنت التواب الرحيم'],
  رزق: ['اللهم اكفني بحلالك عن حرامك وأغنني بفضلك عمن سواك', 'اللهم ارزقني رزقا حلالا طيبا مباركا', 'حسبي الله ونعم الوكيل'],
  زواج: ['رب إني لما أنزلت إلي من خير فقير', 'اللهم ارزقني الزوج الصالح والذرية الطيبة', 'رب هب لي من لدنك ذرية طيبة'],
  عام: ['سبحان الله وبحمده سبحان الله العظيم', 'لا إله إلا الله', 'اللهم صل وسلم على سيدنا محمد'],
};

// ── Build the AI prompt based on question type ───────────────────────────────
function buildPrompt(userMessage: string, history: { role: string; content: string }[], type: string): string {
  const historyText = history
    .slice(-6) // last 3 exchanges max
    .map((m) => `${m.role === 'user' ? 'المستخدم' : 'الرفيق'}: ${m.content}`)
    .join('\n');

  const baseIdentity = `أنت "الرفيق الروحاني" — مساعد إسلامي ذكي ومتخصص. تتحدث بالعربية الفصحى المبسطة وأحيانًا بالعامية المفهومة. ردودك دافئة، علمية، ومؤسسة على القرآن والسنة والفقه الإسلامي.`;

  if (type === 'fatwa') {
    return `${baseIdentity}

سياق المحادثة السابقة:
${historyText}

سأل المستخدم: "${userMessage}"

أجب على هذا السؤال الفقهي/الشرعي بدقة واحترافية:
1. اذكر الحكم الشرعي بوضوح (حلال / حرام / مكروه / مباح / واجب)
2. اذكر الدليل من القرآن أو السنة باختصار
3. اذكر رأي جمهور الفقهاء إن كان هناك خلاف
4. قدم نصيحة عملية للمستخدم
5. إن كان الأمر دقيقًا جدًا أو يحتاج مفتيًا متخصصًا، أشر إلى ذلك بأدب

لا تتردد في إعطاء الحكم الشرعي الواضح. الغموض يضر المسلم.`;
  }

  if (type === 'spiritual') {
    return `${baseIdentity}

سياق المحادثة السابقة:
${historyText}

كتب المستخدم: "${userMessage}"

رد عليه بأسلوب المرشد الروحاني:
- خاطبه شخصيًا وأظهر التعاطف الحقيقي
- قدم 3-4 جمل من النصيحة الروحانية العملية
- اربط حالته بحكمة قرآنية أو نبوية
- اختم بدعاء قصير مناسب لحالته
لا تجعل ردك طويلًا جدًا (6-8 جمل كافية).`;
  }

  if (type === 'dhikr') {
    return `${baseIdentity}

سياق المحادثة السابقة:
${historyText}

طلب المستخدم: "${userMessage}"

قدم له:
1. الذكر أو الدعاء المطلوب كاملًا بالتشكيل
2. مصدره (القرآن / الحديث / كتب الأذكار)
3. فضله وثوابه باختصار
4. أفضل وقت لقوله إن كان له وقت محدد`;
  }

  // general
  return `${baseIdentity}

سياق المحادثة السابقة:
${historyText}

سؤال المستخدم: "${userMessage}"

أجب بأسلوب عالم إسلامي متفتح وودود:
- قدم إجابة علمية دقيقة من منظور إسلامي
- استشهد بالقرآن أو السنة عند الحاجة
- إن كان السؤال غير إسلامي بالكامل، أجب بشكل مفيد مع ربطه بالقيم الإسلامية إن أمكن
الرد في 5-8 جمل.`;
}

// ── Main chat action ─────────────────────────────────────────────────────────
export async function sendChatMessage(
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[],
): Promise<ChatResult> {
  if (!userMessage.trim()) {
    return { message: 'يرجى كتابة رسالتك.', type: 'general', error: 'empty' };
  }

  const type = classifyQuestion(userMessage);
  const emotion = detectEmotion(userMessage);

  // Fetch relevant Quran verses in parallel with AI generation
  const [quranResults] = await Promise.allSettled([
    searchQuran(emotion === 'عام' ? userMessage.slice(0, 20) : emotion, 'ar').catch(() => []),
  ]);

  const verses =
    quranResults.status === 'fulfilled' && quranResults.value.length > 0
      ? quranResults.value.slice(0, 2).map((v) => ({
          text: v.text,
          reference: `آية ${v.numberInSurah}`,
        }))
      : [];

  const dhikr = DHIKR_MAP[emotion] ?? DHIKR_MAP['عام'];
  const prompt = buildPrompt(userMessage, history, type);

  try {
    const aiResponse = await generateGeminiText(prompt, 1500);

    if (!aiResponse) {
      // Graceful fallback without AI
      const fallbacks: Record<string, string> = {
        fatwa: 'لم أتمكن من الاتصال بالذكاء الاصطناعي حاليًا. للحصول على فتوى موثوقة، يُنصح بمراجعة دار الإفتاء أو الاستعانة بعالم متخصص. جزاك الله خيرًا على سؤالك.',
        spiritual: 'اعلم أن الله مع الصابرين، وأن مع العسر يسرًا. استعن بالصلاة والذكر، فإن في ذكر الله تطمئن القلوب.',
        dhikr: 'من أفضل الأذكار: سبحان الله وبحمده سبحان الله العظيم، والاستغفار، والصلاة على النبي صلى الله عليه وسلم.',
        general: 'شكرًا لسؤالك. يمكنك البحث في قسم القرآن والأحاديث في المنصة للحصول على إجابات مفيدة.',
      };
      return {
        message: fallbacks[type] ?? fallbacks.general,
        type,
        verses,
        dhikr: type === 'spiritual' || type === 'dhikr' ? dhikr : undefined,
      };
    }

    return {
      message: aiResponse,
      type,
      verses: type !== 'dhikr' ? verses : undefined,
      dhikr: type === 'spiritual' || type === 'dhikr' ? dhikr : undefined,
    };
  } catch {
    return {
      message: 'حدث خطأ أثناء المعالجة. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
      type,
      error: 'server_error',
    };
  }
}
