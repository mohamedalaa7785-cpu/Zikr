
'use server';

import { generateGeminiText } from '@/lib/services/gemini-client';
import { searchQuran } from '@/lib/services/quran';

export interface ChatCitation {
  label: string;
  reference: string;
  source: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: 'fatwa' | 'spiritual' | 'dhikr' | 'general';
  verses?: { text: string; reference: string }[];
  dhikr?: string[];
  citations?: ChatCitation[];
  confidence?: 'high' | 'medium' | 'low';
  scholarNotice?: string;
}

export interface ChatResult {
  message: string;
  type: 'fatwa' | 'spiritual' | 'dhikr' | 'general';
  verses?: { text: string; reference: string }[];
  dhikr?: string[];
  citations?: ChatCitation[];
  confidence: 'high' | 'medium' | 'low';
  scholarNotice: string;
  error?: string;
}

const SCHOLAR_NOTICE =
  'تنبيه: هذا إرشاد معرفي وروحاني وليس فتوى مُلزِمة. في النوازل والأحكام الشخصية راجع دار إفتاء أو عالمًا مؤهلًا.';

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

function verseReference(ayah: { number?: number; numberInSurah: number }) {
  return ayah.number && ayah.number > 0
    ? `القرآن الكريم، آية ${ayah.numberInSurah} (رقم ${ayah.number})`
    : `القرآن الكريم، آية ${ayah.numberInSurah}`;
}

function buildCitations(verses: { text: string; reference: string }[], type: ChatResult['type']): ChatCitation[] {
  const quranCitations = verses.map((verse) => ({
    label: 'آية',
    reference: verse.reference,
    source: verse.text,
  }));

  const safetyCitation: ChatCitation = {
    label: type === 'fatwa' ? 'توجيه علمي' : 'سياسة أمان',
    reference: 'منهج ZIKR للذكاء الإسلامي',
    source: 'لا تُعرض أحكام شرعية مُلزِمة بلا مصدر واضح، ويُحال المستخدم لأهل العلم عند الحاجة.',
  };

  return [...quranCitations, safetyCitation].slice(0, 4);
}

function buildPrompt(
  userMessage: string,
  history: { role: string; content: string }[],
  type: ChatResult['type'],
  citations: ChatCitation[],
): string {
  const historyText = history
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'المستخدم' : 'الرفيق'}: ${m.content}`)
    .join('\n');

  const sourceText = citations
    .map((c, index) => `${index + 1}. ${c.label} — ${c.reference}: ${c.source}`)
    .join('\n');

  const baseIdentity = `أنت "الرفيق الروحاني" في منصة ZIKR. أجب بالعربية الواضحة، بتواضع علمي، وبلا ادعاء فتوى ملزمة. لا تنسب آية أو حديثًا أو قول عالم إلا إذا كان موجودًا في المصادر المتاحة أدناه. إن لم تكفِ المصادر فقل إن المسألة تحتاج عالمًا مؤهلًا.`;

  if (type === 'fatwa') {
    return `${baseIdentity}

سياق المحادثة السابقة:
${historyText}

سأل المستخدم: "${userMessage}"

أجب على هذا السؤال الفقهي/الشرعي بدقة واحترافية وعلمية:
1. اذكر الحكم الشرعي بوضوح (حلال / حرام / مكروه / مباح / واجب / مندوب)
2. استشهد بآية قرآنية أو حديث نبوي صحيح
3. اذكر إجماع العلماء أو الخلاف المعروف بين المذاهب الفقهية
4. قدم تطبيقًا عمليًا واقعيًا للحكم
5. إن كان الأمر معقدًا أو يحتاج لمفتٍ متخصص، اذكر ذلك بصراحة
6. تجنب الفتاوى الشاذة والآراء الضعيفة

أسلوبك: واثق، علمي، مؤسس على الشريعة. لا تتردد في الحكم الواضح.`;
  }

  if (type === 'spiritual') {
    return `${baseIdentity}

سياق المحادثة السابقة:
${historyText}

كتب المستخدم: "${userMessage}"

رد عليه بأسلوب المرشد الروحاني الحكيم:
- اقرأ مشاعره بعمق وأظهر تعاطفًا صادقًا
- قدم 3-4 نقاط عملية من الحكمة الإسلامية
- استشهد بآية قرآنية أو حديث يناسب حالته تمامًا
- قدم خطوات عملية لتحسين حالته الروحانية
- اختم بدعاء دافئ ومناسب
الأسلوب: دافئ، حكيم، متعاطف. الطول: 7-10 جمل.`;
  }

  if (type === 'dhikr') {
    return `${baseIdentity}

سياق المحادثة السابقة:
${historyText}

طلب المستخدم: "${userMessage}"

قدم له الذكر أو الدعاء بشكل شامل:
1. النص الكامل بالتشكيل الصحيح
2. المصدر الموثوق (القرآن / الحديث الصحيح / كتب الأذكار المعتمدة)
3. الفضل والثواب المترتب عليه من الكتاب والسنة
4. أفضل الأوقات والحالات لقوله
5. عدد المرات المسنونة إن وجدت
الأسلوب: دقيق، موثوق، مفيد.`;
  }

  // general
  return `${baseIdentity}

سياق المحادثة السابقة:
${historyText}

سؤال المستخدم: "${userMessage}"

أجب بأسلوب عالم إسلامي حكيم وودود:
- قدم إجابة علمية دقيقة من منظور إسلامي
- استشهد بآيات قرآنية أو أحاديث صحيحة عند الحاجة
- اربط الموضوع بالقيم الإسلامية والحكمة النبوية
- قدم فائدة عملية للمستخدم
الأسلوب: واضح، متعلم، ودود. الطول: 6-9 جمل.`;
}

function fallbackFor(type: ChatResult['type'], verses: { text: string; reference: string }[], dhikr?: string[]): string {
  if (type === 'fatwa') {
    return 'لا أستطيع إصدار حكم شرعي مُلزِم بلا تحقق كامل من الأدلة وسياق الواقعة. إن كان السؤال متعلقًا بمعاملة أو أسرة أو عبادة بتفاصيل خاصة، فالأحوط عرضه على دار إفتاء أو عالم موثوق. يمكنك استخدام نتائج القرآن المعروضة هنا كبداية للتأمل لا كفتوى نهائية.';
  }
  if (type === 'spiritual') {
    return 'أسأل الله أن يشرح صدرك وييسر أمرك. خذ بالأسباب الهادئة: صلاة ركعتين، ذكر قصير ثابت، والحديث مع شخص أمين إن كان الضيق شديدًا. تذكّر أن رحمة الله قريبة، وأن طلب المساعدة لا ينافي التوكل.';
  }
  if (type === 'dhikr') {
    return `يمكنك البدء بهذه الأذكار بتدبر وهدوء:\n${(dhikr ?? DHIKR_MAP['عام']).map((item) => `• ${item}`).join('\n')}`;
  }
  return verses.length > 0
    ? 'وجدت لك آيات ذات صلة يمكن أن تكون بداية للبحث والتدبر. إن كان السؤال يحتاج حكمًا تفصيليًا، فارجع لأهل العلم مع بيان تفاصيل الواقعة.'
    : 'لم أجد مصدرًا كافيًا للإجابة بثقة. أعد صياغة السؤال بتفاصيل أو ابحث في أقسام القرآن والحديث داخل ZIKR.';
}

export async function sendChatMessage(
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[],
): Promise<ChatResult> {
  const normalizedMessage = userMessage.trim().slice(0, 1200);
  if (!normalizedMessage) {
    return {
      message: 'يرجى كتابة رسالتك.',
      type: 'general',
      confidence: 'low',
      scholarNotice: SCHOLAR_NOTICE,
      error: 'empty',
    };
  }

  const type = classifyQuestion(normalizedMessage);
  const emotion = detectEmotion(normalizedMessage);
  const quranResults = await searchQuran(
    emotion === 'عام' ? normalizedMessage.slice(0, 40) : emotion,
    'ar',
  ).catch(() => []);

  const verses = quranResults.slice(0, 2).map((v) => ({
    text: v.text,
    reference: verseReference(v),
  }));
  const dhikr = DHIKR_MAP[emotion] ?? DHIKR_MAP['عام'];
  const citations = buildCitations(verses, type);
  const prompt = buildPrompt(normalizedMessage, history, type, citations);
  const confidence: ChatResult['confidence'] = verses.length > 0 ? 'medium' : 'low';

  try {
    const aiResponse = await generateGeminiText(prompt, 1500);
    const message = aiResponse?.trim() || fallbackFor(type, verses, dhikr);

    return {
      message,
      type,
      verses: type !== 'dhikr' ? verses : undefined,
      dhikr: type === 'spiritual' || type === 'dhikr' ? dhikr : undefined,
      citations,
      confidence,
      scholarNotice: SCHOLAR_NOTICE,
    };
  } catch {
    return {
      message: fallbackFor(type, verses, dhikr),
      type,
      verses: type !== 'dhikr' ? verses : undefined,
      dhikr: type === 'spiritual' || type === 'dhikr' ? dhikr : undefined,
      citations,
      confidence: 'low',
      scholarNotice: SCHOLAR_NOTICE,
      error: 'server_error',
    };
  }
}
