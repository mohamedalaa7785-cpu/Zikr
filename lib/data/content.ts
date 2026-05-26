export type Surah={id:number;nameAr:string;nameEn:string;ayahCount:number;revelationPlace:string;slug:string};
export type Ayah={surahId:number;ayahNumber:number;textUthmani:string;textSimple:string;page:number;juz:number;hizb:number;rub:number;sajda:boolean};
export type Tafsir={surahId:number;ayahNumber:number;source:string;text:string};
export type Reciter={id:string;nameAr:string;nameEn:string;code:string;baseUrlTemplate:string};
export type HadithBook={id:string;slug:string;nameAr:string;nameEn:string;source:string};
export type Hadith={id:string;bookId:string;hadithNumber:string;textAr:string;narrator:string;grade:string;chapter:string;ref:string};

export const surahs:Surah[]=[{id:1,nameAr:'الفاتحة',nameEn:'Al-Fatihah',ayahCount:7,revelationPlace:'meccan',slug:'al-fatihah'},{id:2,nameAr:'البقرة',nameEn:'Al-Baqarah',ayahCount:286,revelationPlace:'medinan',slug:'al-baqarah'},{id:112,nameAr:'الإخلاص',nameEn:'Al-Ikhlas',ayahCount:4,revelationPlace:'meccan',slug:'al-ikhlas'}];
export const ayahs:Ayah[]=[{surahId:1,ayahNumber:1,textUthmani:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',textSimple:'بسم الله الرحمن الرحيم',page:1,juz:1,hizb:1,rub:1,sajda:false},{surahId:1,ayahNumber:2,textUthmani:'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',textSimple:'الحمد لله رب العالمين',page:1,juz:1,hizb:1,rub:1,sajda:false},{surahId:112,ayahNumber:1,textUthmani:'قُلْ هُوَ اللَّهُ أَحَدٌ',textSimple:'قل هو الله أحد',page:604,juz:30,hizb:60,rub:240,sajda:false}];
export const tafsir:Tafsir[]=[{surahId:1,ayahNumber:1,source:'التفسير الميسر',text:'ابتداءٌ باسم الله الجامع لصفات الكمال.'},{surahId:1,ayahNumber:2,source:'التفسير الميسر',text:'الثناء على الله رب جميع الخلق.'}];
export const reciters:Reciter[]=[{id:'husary',nameAr:'الحصري',nameEn:'Al-Husary',code:'husary',baseUrlTemplate:'https://everyayah.com/data/Husary_128kbps'},{id:'minshawi',nameAr:'المنشاوي',nameEn:'Al-Minshawi',code:'minshawi',baseUrlTemplate:'https://everyayah.com/data/Minshawy_Murattal_128kbps'}];
export const hadithBooks:HadithBook[]=[{id:'bukhari',slug:'bukhari',nameAr:'صحيح البخاري',nameEn:'Sahih al-Bukhari',source:'sunnah.com'}];
export const hadiths:Hadith[]=[{id:'b1',bookId:'bukhari',hadithNumber:'1',textAr:'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ...',narrator:'عمر بن الخطاب',grade:'صحيح',chapter:'بدء الوحي',ref:'bukhari:1'}];
