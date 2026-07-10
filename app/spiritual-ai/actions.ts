'use server';

/**
 * @openapi
 * POST /spiritual-ai/search (Server Action: searchSpiritualContent)
 *
 * Summary: Search spiritual content by feeling
 * Description: Detects feeling from user text, returns relevant Quran verses, hadiths, dhikr, and AI-generated advice using Google Gemini.
 * Tags: AI, Spiritual
 * Auth: None
 *
 * Request:
 *   - feeling: string (required) - User's feeling text (Arabic)
 *
 * Response:
 *   - feeling: string - Detected feeling
 *   - responses: SpiritualResponse[] - Array of { type, content, source, reference }
 *   - aiAdvice: string (optional) - AI-generated advice
 *   - error: string (optional) - Error message
 */
import { generateGeminiText } from '@/lib/services/gemini-client';
import { searchQuran } from '@/lib/services/quran';

export interface SpiritualResponse {
  type: 'quran' | 'hadith' | 'dhikr' | 'advice' | 'poem';
  content: string;
  source?: string;
  reference?: string;
}

export interface AISearchResult {
  feeling: string;
  responses: SpiritualResponse[];
  aiAdvice?: string;
  error?: string;
}

const HADITH_THEMES: Record<string, string[]> = {
  حزن: [
    'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    'لاَ يُكَلِّفُ اللَّهُ نَفْسًا إِلاَّ وُسْعَهَا',
  ],
  قلق: [
    'مَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
  ],
  فرح: [
    'وَإِذَا شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
  ],
  خوف: [
    'إِنَّ اللَّهَ مَعَنَا',
    'لاَ تَحْزَنْ إِنَّ اللَّهَ مَعَنَا',
  ],
  غضب: [
    'وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ',
    'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضْبِ',
  ],
  شكر: [
    'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ',
  ],
  صبر: [
    'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ',
    'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ',
  ],
  ذنب: [
    'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَى أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
    'وَمَن يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ يَجِدِ اللَّهَ غَفُورًا رَّحِيمًا',
  ],
  رزق: [
    'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    'وَمَا مِن دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا',
  ],
  زواج: [
    'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا',
    'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
  ],
};

const DHIKR_FOR_FEELINGS: Record<string, string[]> = {
  حزن: ['لا حول ولا قوة إلا بالله', 'حسبي الله ونعم الوكيل', 'إنا لله وإنا إليه راجعون'],
  قلق: ['حسبي الله لا إله إلا هو عليه توكلت', 'اللهم إني أعوذ بك من الهم والحزن', 'يا حي يا قيوم برحمتك أستغيث'],
  فرح: ['الحمد لله رب العالمين', 'سبحان الله وبحمده', 'الله أكبر'],
  خوف: ['حسبنا الله ونعم الوكيل', 'بسم الله الذي لا يضر مع اسمه شيء', 'أعوذ بكلمات الله التامات من شر ما خلق'],
  غضب: ['أعوذ بالله من الشيطان الرجيم', 'اللهم اغفر لي وارحمني', 'لا إله إلا أنت سبحانك إني كنت من الظالمين'],
  شكر: ['الحمد لله الذي بنعمته تتم الصالحات', 'اللهم لك الحمد كما ينبغي لجلال وجهك', 'سبحان الله وبحمده سبحان الله العظيم'],
  صبر: ['إنا لله وإنا إليه راجعون', 'اللهم أجرني في مصيبتي واخلف لي خيرا منها', 'لا حول ولا قوة إلا بالله العلي العظيم'],
  ذنب: ['أستغفر الله العظيم وأتوب إليه', 'اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك', 'رب اغفر لي وتب علي إنك أنت التواب الرحيم'],
  رزق: ['اللهم اكفني بحلالك عن حرامك وأغنني بفضلك عمن سواك', 'اللهم ارزقني رزقا حلالا طيبا مباركا', 'حسبي الله ونعم الوكيل'],
  زواج: ['رب إني لما أنزلت إلي من خير فقير', 'اللهم ارزقني الزوج الصالح والذرية الطيبة', 'رب هب لي من لدنك ذرية طيبة'],
  عام: ['سبحان الله', 'الحمد لله', 'الله أكبر', 'لا إله إلا الله'],
};

function detectFeeling(text: string): string {
  const feelingsKeywords: Record<string, string[]> = {
    حزن: ['حزين', 'حزن', 'مكتئب', 'اكتئاب', 'ضيق', 'همّ', 'غم', 'كآبة', 'مؤلم', 'ألم', 'فقدان', 'وحدة', 'وحيد', 'يأس', 'إحباط', 'محبط', 'تعبان نفسيا'],
    قلق: ['قلق', 'توتر', 'متوتر', 'مرتبك', 'قلقان', 'مضطرب', 'ارتباك', 'وسواس', 'أرق', 'مش قادر أنام', 'المستقبل'],
    فرح: ['سعيد', 'فرحان', 'سعادة', 'فرح', 'مبسوط', 'نعمة', 'بركة', 'نجحت', 'اتخطبت', 'اتجوزت', 'خلفت'],
    خوف: ['خوف', 'خائف', 'مرعوب', 'رعب', 'فزع', 'خايف'],
    غضب: ['غاضب', 'غضب', 'عصبي', 'زعلان', 'مستفز', 'متضايق', 'ظلمني', 'ظلم'],
    شكر: ['شاكر', 'شكر', 'ممتن', 'امتنان', 'حمد', 'الحمد لله'],
    صبر: ['صبر', 'صابر', 'ابتلاء', 'امتحان', 'محنة', 'بلاء', 'مرض', 'مريض', 'وفاة', 'توفى', 'مات'],
    ذنب: ['ذنب', 'ذنوب', 'معصية', 'عصيت', 'أذنبت', 'توبة', 'أتوب', 'ندم', 'نادم', 'غلطت'],
    رزق: ['رزق', 'فلوس', 'مال', 'دين', 'ديون', 'مديون', 'شغل', 'وظيفة', 'عاطل', 'فقر', 'فقير'],
    زواج: ['زواج', 'عنوسة', 'نصيب', 'شريك', 'أتجوز', 'خطبة', 'طلاق', 'مطلقة', 'انفصال'],
  };

  const normalizedText = text.toLowerCase();

  for (const [feeling, keywords] of Object.entries(feelingsKeywords)) {
    if (keywords.some(keyword => normalizedText.includes(keyword))) {
      return feeling;
    }
  }

  return 'عام';
}

export async function searchSpiritualContent(feeling: string): Promise<AISearchResult> {
  try {
    const detectedFeeling = detectFeeling(feeling);
    const responses: SpiritualResponse[] = [];

    // Get relevant Quran verses
    const quranResults = await searchQuran(detectedFeeling, 'ar');
    if (quranResults.length > 0) {
      responses.push({
        type: 'quran',
        content: quranResults[0].text,
        source: 'القرآن الكريم',
        reference: `آية ${quranResults[0].numberInSurah}`,
      });
    }

    // Get relevant hadiths
    const hadithThemes = HADITH_THEMES[detectedFeeling] || HADITH_THEMES['صبر'];
    if (hadithThemes.length > 0) {
      responses.push({
        type: 'hadith',
        content: hadithThemes[Math.floor(Math.random() * hadithThemes.length)],
        source: 'حديث شريف / آية قرآنية',
      });
    }

    // Get dhikr suggestions
    const dhikrList = DHIKR_FOR_FEELINGS[detectedFeeling] || DHIKR_FOR_FEELINGS['عام'];
    dhikrList.forEach((dhikr) => {
      responses.push({
        type: 'dhikr',
        content: dhikr,
        source: 'أذكار',
      });
    });

    // Get AI-generated advice using Gemini
    let aiAdvice: string | undefined;
    try {
      const prompt = `أنت "الرفيق الروحاني" — مرشد إسلامي حكيم ورحيم يتحدث بلغة عربية دافئة وقريبة من القلب.
كتب لك شخص هذه الرسالة: "${feeling}"
(الشعور المكتشف: ${detectedFeeling})

رد عليه برد شخصي مباشر يخاطب ما كتبه هو تحديدا (وليس ردا عاما):
- ابدأ بمواساة أو تهنئة تناسب حالته
- قدم نصيحة عملية من تعاليم الإسلام في 4-5 جمل
- اختم بدعاء قصير مناسب لحالته
لا تذكر آيات أو أحاديث بنصها، فهي ستعرض له بشكل منفصل.`;

      const generated = await generateGeminiText(prompt);
      if (generated) {
        aiAdvice = generated;
      }
    } catch {
      // Fallback advice if AI fails
      aiAdvice = 'اعلم أن الله مع الصابرين، وأن كل ضيق يعقبه فرج. استعن بالصلاة والذكر، فإن في ذكر الله تطمئن القلوب. اللهم اشرح صدرك ويسر أمرك.';
    }

    return {
      feeling: detectedFeeling,
      responses,
      aiAdvice,
    };
  } catch (error) {
    return {
      feeling: 'عام',
      responses: [],
      error: 'حدث خطأ أثناء البحث. حاول مرة أخرى.',
    };
  }
}
