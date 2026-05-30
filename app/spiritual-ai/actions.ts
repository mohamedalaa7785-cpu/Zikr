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
    'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
  ],
  شكر: [
    'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ',
  ],
  صبر: [
    'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ',
    'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ',
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
  عام: ['سبحان الله', 'الحمد لله', 'الله أكبر', 'لا إله إلا الله'],
};

function detectFeeling(text: string): string {
  const feelingsKeywords: Record<string, string[]> = {
    حزن: ['حزين', 'حزن', 'مكتئب', 'اكتئاب', 'ضيق', 'همّ', 'غم', 'كآبة', 'مؤلم', 'ألم', 'فقدان', 'وحدة', 'وحيد'],
    قلق: ['قلق', 'خائف', 'توتر', 'متوتر', 'مرتبك', 'قلقان', 'مضطرب', 'ارتباك'],
    فرح: ['سعيد', 'فرحان', 'سعادة', 'فرح', 'مبسوط', 'شكر', 'نعمة', 'بركة'],
    خوف: ['خوف', 'خائف', 'مرعوب', 'رعب', 'فزع'],
    غضب: ['غاضب', 'غضب', 'عصبي', 'زعلان', 'مستفز'],
    شكر: ['شاكر', 'شكر', 'ممتن', 'امتنان', 'حمد'],
    صبر: ['صبر', 'صابر', 'ابتلاء', 'امتحان', 'محنة', 'بلاء'],
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
      const prompt = `أنت مستشار روحاني إسلامي. شخص يشعر بـ "${feeling}". 
قدم نصيحة روحانية قصيرة (3-4 جمل فقط) باللغة العربية تستند إلى تعاليم الإسلام.
اذكر فضل الصبر والتوكل على الله. لا تذكر آيات أو أحاديث، فقط نصيحة عامة.`;
      
      const generated = await generateGeminiText(prompt);
      if (generated) {
        aiAdvice = generated;
      }
    } catch {
      // Fallback advice if AI fails
      aiAdvice = 'اعلم أن الله مع الصابرين، وأن كل ضيق يعقبه فرج. استعن بالصلاة والذكر، فإن في ذكر الله تطمئن القلوب.';
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
