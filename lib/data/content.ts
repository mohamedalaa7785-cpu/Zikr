export type Surah={id:number;nameAr:string;nameEn:string;ayahCount:number;revelationPlace:string;slug:string};
export type Ayah={surahId:number;ayahNumber:number;textUthmani:string;textSimple:string;page:number;juz:number;hizb:number;rub:number;sajda:boolean};
export type Tafsir={surahId:number;ayahNumber:number;source:string;text:string};
export type Reciter={id:string;nameAr:string;nameEn:string;code:string;baseUrlTemplate:string;type:'surah'|'ayah'};
export type HadithBook={id:string;slug:string;nameAr:string;nameEn:string;source:string};
export type Hadith={id:string;bookId:string;hadithNumber:string;textAr:string;narrator:string;grade:string;chapter:string;ref:string};

export const surahs:Surah[]=[
  {id:1,nameAr:'الفاتحة',nameEn:'Al-Fatihah',ayahCount:7,revelationPlace:'meccan',slug:'al-fatihah'},
  {id:2,nameAr:'البقرة',nameEn:'Al-Baqarah',ayahCount:286,revelationPlace:'medinan',slug:'al-baqarah'},
  {id:3,nameAr:'آل عمران',nameEn:'Aal-Imran',ayahCount:200,revelationPlace:'medinan',slug:'aal-imran'},
  {id:36,nameAr:'يس',nameEn:'Ya-Sin',ayahCount:83,revelationPlace:'meccan',slug:'ya-sin'},
  {id:55,nameAr:'الرحمن',nameEn:'Ar-Rahman',ayahCount:78,revelationPlace:'medinan',slug:'ar-rahman'},
  {id:67,nameAr:'الملك',nameEn:'Al-Mulk',ayahCount:30,revelationPlace:'meccan',slug:'al-mulk'},
  {id:112,nameAr:'الإخلاص',nameEn:'Al-Ikhlas',ayahCount:4,revelationPlace:'meccan',slug:'al-ikhlas'},
  {id:113,nameAr:'الفلق',nameEn:'Al-Falaq',ayahCount:5,revelationPlace:'meccan',slug:'al-falaq'},
  {id:114,nameAr:'الناس',nameEn:'An-Nas',ayahCount:6,revelationPlace:'meccan',slug:'an-nas'},
];

export const ayahs:Ayah[]=[
  {surahId:1,ayahNumber:1,textUthmani:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',textSimple:'بسم الله الرحمن الرحيم',page:1,juz:1,hizb:1,rub:1,sajda:false},
  {surahId:1,ayahNumber:2,textUthmani:'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',textSimple:'الحمد لله رب العالمين',page:1,juz:1,hizb:1,rub:1,sajda:false},
  {surahId:112,ayahNumber:1,textUthmani:'قُلْ هُوَ اللَّهُ أَحَدٌ',textSimple:'قل هو الله أحد',page:604,juz:30,hizb:60,rub:240,sajda:false},
];

export const tafsir:Tafsir[]=[
  {surahId:1,ayahNumber:1,source:'التفسير الميسر',text:'ابتداءٌ باسم الله الجامع لصفات الكمال.'},
  {surahId:1,ayahNumber:2,source:'التفسير الميسر',text:'الثناء على الله رب جميع الخلق.'},
];

export const reciters:Reciter[]=[
  {id:'alafasy',nameAr:'مشاري راشد العفاسي',nameEn:'Mishary Rashid Alafasy',code:'ar.alafasy',baseUrlTemplate:'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy',type:'surah'},
  {id:'minshawi',nameAr:'محمد صديق المنشاوي',nameEn:'Muhammad Siddiq Al-Minshawi',code:'ar.minshawi',baseUrlTemplate:'https://cdn.islamic.network/quran/audio-surah/128/ar.minshawi',type:'surah'},
  {id:'husary',nameAr:'محمود خليل الحصري',nameEn:'Mahmoud Khalil Al-Husary',code:'ar.husary',baseUrlTemplate:'https://cdn.islamic.network/quran/audio-surah/128/ar.husary',type:'surah'},
  {id:'abdulbasit',nameAr:'عبد الباسط عبد الصمد',nameEn:'Abdul Basit Abdul Samad',code:'ar.abdulsamad',baseUrlTemplate:'https://cdn.islamic.network/quran/audio-surah/128/ar.abdulsamad',type:'surah'},
  {id:'sudais',nameAr:'عبد الرحمن السديس',nameEn:'Abdurrahman As-Sudais',code:'ar.as-sudais',baseUrlTemplate:'https://cdn.islamic.network/quran/audio-surah/128/ar.as-sudais',type:'surah'},
  {id:'shuraim',nameAr:'سعود الشريم',nameEn:'Saud Al-Shuraim',code:'ar.shuraym',baseUrlTemplate:'https://cdn.islamic.network/quran/audio-surah/128/ar.shuraym',type:'surah'},
  {id:'mahermuaiqly',nameAr:'ماهر المعيقلي',nameEn:'Maher Al-Muaiqly',code:'ar.mahermuaiqly',baseUrlTemplate:'https://cdn.islamic.network/quran/audio-surah/128/ar.mahermuaiqly',type:'surah'},
  {id:'ghamdi',nameAr:'سعد الغامدي',nameEn:'Saad Al-Ghamdi',code:'ar.saadghamidi',baseUrlTemplate:'https://cdn.islamic.network/quran/audio-surah/128/ar.saadghamidi',type:'surah'},
];

export const hadithBooks:HadithBook[]=[
  {id:'bukhari',slug:'bukhari',nameAr:'صحيح البخاري',nameEn:'Sahih al-Bukhari',source:'sunnah.com'},
  {id:'muslim',slug:'muslim',nameAr:'صحيح مسلم',nameEn:'Sahih Muslim',source:'sunnah.com'},
  {id:'tirmidhi',slug:'tirmidhi',nameAr:'سنن الترمذي',nameEn:'Jami at-Tirmidhi',source:'sunnah.com'},
  {id:'abudawud',slug:'abudawud',nameAr:'سنن أبي داود',nameEn:'Sunan Abu Dawud',source:'sunnah.com'},
];

export const hadiths:Hadith[]=[
  {id:'b1',bookId:'bukhari',hadithNumber:'1',textAr:'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى...',narrator:'عمر بن الخطاب رضي الله عنه',grade:'صحيح',chapter:'بدء الوحي',ref:'bukhari:1'},
  {id:'b2',bookId:'bukhari',hadithNumber:'13',textAr:'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.',narrator:'أنس بن مالك رضي الله عنه',grade:'صحيح',chapter:'الإيمان',ref:'bukhari:13'},
];
