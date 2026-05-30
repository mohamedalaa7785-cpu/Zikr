'use server';

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

// Quran verses for different feelings
const QURAN_VERSES: Record<string, { verse: string; reference: string }[]> = {
  حزن: [
    { verse: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا * إِنَّ مَعَ الْعُسْرِ يُسْرًا', reference: 'الشرح: 5-6' },
    { verse: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ', reference: 'آل عمران: 139' },
    { verse: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', reference: 'الرعد: 28' },
  ],
  قلق: [
    { verse: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', reference: 'الطلاق: 3' },
    { verse: 'لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا', reference: 'التوبة: 40' },
    { verse: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', reference: 'آل عمران: 173' },
  ],
  خوف: [
    { verse: 'إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا تَتَنَزَّلُ عَلَيْهِمُ الْمَلَائِكَةُ أَلَّا تَخَافُوا وَلَا تَحْزَنُوا', reference: 'فصلت: 30' },
    { verse: 'قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا هُوَ مَوْلَانَا وَعَلَى اللَّهِ فَلْيَتَوَكَّلِ الْمُؤْمِنُونَ', reference: 'التوبة: 51' },
  ],
  غضب: [
    { verse: 'وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ', reference: 'آل عمران: 134' },
    { verse: 'وَإِذَا مَا غَضِبُوا هُمْ يَغْفِرُونَ', reference: 'الشورى: 37' },
  ],
  شكر: [
    { verse: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', reference: 'إبراهيم: 7' },
    { verse: 'وَقَلِيلٌ مِّنْ عِبَادِيَ الشَّكُورُ', reference: 'سبأ: 13' },
    { verse: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', reference: 'البقرة: 152' },
  ],
  صبر: [
    { verse: 'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ', reference: 'الزمر: 10' },
    { verse: 'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ', reference: 'النحل: 127' },
    { verse: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', reference: 'البقرة: 153' },
  ],
  فرح: [
    { verse: 'قُلْ بِفَضْلِ اللَّهِ وَبِرَحْمَتِهِ فَبِذَٰلِكَ فَلْيَفْرَحُوا هُوَ خَيْرٌ مِّمَّا يَجْمَعُونَ', reference: 'يونس: 58' },
  ],
  وحدة: [
    { verse: 'وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ', reference: 'ق: 16' },
    { verse: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ', reference: 'الحديد: 4' },
  ],
};

// Hadiths for different feelings
const HADITHS: Record<string, { hadith: string; narrator: string }[]> = {
  حزن: [
    { hadith: 'ما يُصِيبُ المُؤْمِنَ مِن وَصَبٍ ولا نَصَبٍ ولا سَقَمٍ ولا حُزْنٍ حتَّى الهَمِّ يُهَمُّهُ، إلَّا كُفِّرَ به مِن سَيِّئاتِهِ', narrator: 'صحيح البخاري' },
    { hadith: 'اللهم إني أعوذ بك من الهم والحزن', narrator: 'صحيح البخاري' },
  ],
  قلق: [
    { hadith: 'عجباً لأمر المؤمن، إن أمره كله خير، إن أصابته سراء شكر فكان خيراً له، وإن أصابته ضراء صبر فكان خيراً له', narrator: 'صحيح مسلم' },
    { hadith: 'احفظ الله يحفظك، احفظ الله تجده تجاهك', narrator: 'الترمذي' },
  ],
  خوف: [
    { hadith: 'اعلم أن ما أخطأك لم يكن ليصيبك، وما أصابك لم يكن ليخطئك', narrator: 'صحيح' },
    { hadith: 'لو أنكم توكلتم على الله حق توكله لرزقكم كما يرزق الطير، تغدو خماصاً وتروح بطاناً', narrator: 'الترمذي' },
  ],
  غضب: [
    { hadith: 'ليس الشديد بالصُّرَعة، إنما الشديد الذي يملك نفسه عند الغضب', narrator: 'متفق عليه' },
    { hadith: 'إذا غضب أحدكم وهو قائم فليجلس، فإن ذهب عنه الغضب وإلا فليضطجع', narrator: 'أبو داود' },
  ],
  شكر: [
    { hadith: 'من لا يشكر الناس لا يشكر الله', narrator: 'الترمذي' },
    { hadith: 'الطاعم الشاكر بمنزلة الصائم الصابر', narrator: 'الترمذي' },
  ],
  صبر: [
    { hadith: 'إنما الصبر عند الصدمة الأولى', narrator: 'متفق عليه' },
    { hadith: 'ما أعطي أحد عطاءً خيراً وأوسع من الصبر', narrator: 'متفق عليه' },
  ],
  فرح: [
    { hadith: 'تبسمك في وجه أخيك صدقة', narrator: 'الترمذي' },
  ],
  وحدة: [
    { hadith: 'من لزم الاستغفار جعل الله له من كل ضيق مخرجاً، ومن كل هم فرجاً، ورزقه من حيث لا يحتسب', narrator: 'أبو داود' },
  ],
};

const DHIKR_FOR_FEELINGS: Record<string, string[]> = {
  حزن: [
    'لا حول ولا قوة إلا بالله',
    'حسبي الله ونعم الوكيل',
    'إنا لله وإنا إليه راجعون',
    'اللهم أجرني في مصيبتي واخلف لي خيراً منها',
  ],
  قلق: [
    'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم',
    'اللهم إني أعوذ بك من الهم والحزن',
    'يا حي يا قيوم برحمتك أستغيث',
    'لا إله إلا أنت سبحانك إني كنت من الظالمين',
  ],
  خوف: [
    'حسبنا الله ونعم الوكيل',
    'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء',
    'أعوذ بكلمات الله التامات من شر ما خلق',
    'اللهم إني أعوذ بك من شر ما خلقت',
  ],
  غضب: [
    'أعوذ بالله من الشيطان الرجيم',
    'اللهم اغفر لي وارحمني واهدني',
    'لا إله إلا أنت سبحانك إني كنت من الظالمين',
  ],
  شكر: [
    'الحمد لله الذي بنعمته تتم الصالحات',
    'اللهم لك الحمد كما ينبغي لجلال وجهك وعظيم سلطانك',
    'سبحان الله وبحمده سبحان الله العظيم',
    'الحمد لله رب العالمين',
  ],
  صبر: [
    'إنا لله وإنا إليه راجعون',
    'اللهم أجرني في مصيبتي واخلف لي خيرا منها',
    'لا حول ولا قوة إلا بالله العلي العظيم',
    'قدر الله وما شاء فعل',
  ],
  فرح: [
    'الحمد لله',
    'ما شاء الله لا قوة إلا بالله',
    'اللهم بارك',
  ],
  وحدة: [
    'يا ودود يا ودود',
    'اللهم إني أسألك حبك وحب من يحبك',
    'سبحان الله وبحمده',
  ],
  عام: [
    'سبحان الله',
    'الحمد لله',
    'الله أكبر',
    'لا إله إلا الله',
    'أستغفر الله العظيم وأتوب إليه',
  ],
};

function detectFeeling(text: string): string {
  const feelingsKeywords: Record<string, string[]> = {
    حزن: ['حزين', 'حزن', 'مكتئب', 'اكتئاب', 'ضيق', 'همّ', 'غم', 'كآبة', 'مؤلم', 'ألم', 'فقدان', 'مكسور', 'دموع', 'بكاء', 'يائس', 'يأس', 'محبط', 'إحباط'],
    قلق: ['قلق', 'قلقان', 'توتر', 'متوتر', 'مرتبك', 'ارتباك', 'مضطرب', 'خائف من المستقبل', 'مهموم', 'هموم', 'ضغط', 'ضغوط'],
    خوف: ['خوف', 'خائف', 'مرعوب', 'رعب', 'فزع', 'مخيف', 'رهبة', 'وجل'],
    غضب: ['غاضب', 'غضب', 'عصبي', 'زعلان', 'مستفز', 'محتقن', 'ثائر', 'منفعل'],
    شكر: ['شاكر', 'شكر', 'ممتن', 'امتنان', 'حمد', 'نعمة', 'بركة', 'فضل'],
    صبر: ['صبر', 'صابر', 'ابتلاء', 'امتحان', 'محنة', 'بلاء', 'مصيبة', 'صعوبة'],
    فرح: ['سعيد', 'فرحان', 'سعادة', 'فرح', 'مبسوط', 'سرور', 'بهجة', 'مسرور'],
    وحدة: ['وحيد', 'وحدة', 'وحشة', 'منعزل', 'عزلة', 'بعيد', 'غريب', 'لا أحد'],
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

    // Get relevant Quran verses from our predefined list
    const quranVerses = QURAN_VERSES[detectedFeeling] || QURAN_VERSES['صبر'];
    if (quranVerses && quranVerses.length > 0) {
      // Add 1-2 verses
      const versesToAdd = quranVerses.slice(0, 2);
      versesToAdd.forEach(v => {
        responses.push({
          type: 'quran',
          content: v.verse,
          source: 'القرآن الكريم',
          reference: v.reference,
        });
      });
    }

    // Also try to search using API for more variety
    try {
      const quranResults = await searchQuran(detectedFeeling, 'ar');
      if (quranResults.length > 0 && quranResults[0].text) {
        responses.push({
          type: 'quran',
          content: quranResults[0].text,
          source: 'القرآن الكريم',
          reference: `آية ${quranResults[0].numberInSurah}`,
        });
      }
    } catch {
      // API search failed, continue with predefined verses
    }

    // Get relevant hadiths
    const hadithsList = HADITHS[detectedFeeling] || HADITHS['صبر'];
    if (hadithsList && hadithsList.length > 0) {
      const hadithToAdd = hadithsList[Math.floor(Math.random() * hadithsList.length)];
      responses.push({
        type: 'hadith',
        content: hadithToAdd.hadith,
        source: 'حديث شريف',
        reference: hadithToAdd.narrator,
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
      const prompt = `أنت مستشار روحاني إسلامي رحيم وحكيم. شخص يشعر بـ "${feeling}". 
قدم نصيحة روحانية دافئة ومطمئنة (4-5 جمل) باللغة العربية تستند إلى تعاليم الإسلام.
اذكر فضل الصبر والتوكل على الله والتقرب إليه. 
النصيحة يجب أن تكون:
- مطمئنة ورحيمة
- مبنية على القرآن والسنة
- عملية ويمكن تطبيقها
لا تذكر آيات أو أحاديث محددة، فقط نصيحة عامة تلامس القلب.`;
      
      const generated = await generateGeminiText(prompt);
      if (generated) {
        aiAdvice = generated;
      }
    } catch {
      // Fallback advice if AI fails
      const fallbackAdvices: Record<string, string> = {
        حزن: 'اعلم أن الحزن جزء من رحلة الحياة، وأن الله قريب من المنكسرة قلوبهم. استعن بالصلاة والذكر، فإن في ذكر الله تطمئن القلوب. تذكر أن بعد العسر يسرا، وأن الله لا يكلف نفسا إلا وسعها.',
        قلق: 'القلق من المستقبل يعني أننا نسينا أن المستقبل بيد الله وحده. توكل على الله واعلم أنه خير حافظ وأرحم الراحمين. ما قدره الله لك سيأتيك، فاطمئن ولا تحمل هم غد.',
        خوف: 'الخوف طبيعي، لكن المؤمن يتسلح بالتوكل على الله. من كان الله معه فمن عليه؟ استعذ بالله واستشعر معيته في كل لحظة، فإنه أقرب إليك من حبل الوريد.',
        غضب: 'الغضب جمرة يلقيها الشيطان في القلب. استعذ بالله، وتوضأ، واجلس إن كنت قائما. تذكر أن كظم الغيظ من صفات المتقين، وأن الحلم سيد الأخلاق.',
        شكر: 'الحمد لله على نعمه الظاهرة والباطنة. استمر في شكر الله تزدد نعما، فمن شكر زاده الله. اجعل الحمد والشكر عادة يومية تملأ قلبك سكينة.',
        صبر: 'الصبر نصف الإيمان، وأجره عظيم عند الله. تذكر أن كل ابتلاء هو تكفير للذنوب ورفع للدرجات. اصبر صبرا جميلا، فإن الفرج قريب.',
        فرح: 'الحمد لله على هذه النعمة. اشكر الله واحمده، واعلم أن الفرح الحقيقي في القرب من الله. شارك فرحتك مع الآخرين وتصدق شكرا لله.',
        وحدة: 'لست وحيدا أبدا، فالله معك أينما كنت. هو أقرب إليك من حبل الوريد. ناجه في صلاتك، وتحدث معه في سجودك، واشعر بأنسه وقربه.',
        عام: 'اعلم أن الله مع الصابرين، وأن كل ضيق يعقبه فرج. استعن بالصلاة والذكر، فإن في ذكر الله تطمئن القلوب. ثق بالله وأحسن الظن به.',
      };
      aiAdvice = fallbackAdvices[detectedFeeling] || fallbackAdvices['عام'];
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
