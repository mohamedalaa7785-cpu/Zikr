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
  {id:'alafasy',nameAr:'مشاري راشد العفاسي',nameEn:'Mishary Rashid Alafasy',code:'alafasy',baseUrlTemplate:'https://server8.mp3quran.net/afs',type:'surah'},
  {id:'minshawi',nameAr:'محمد صديق المنشاوي',nameEn:'Muhammad Siddiq Al-Minshawi',code:'minshawi',baseUrlTemplate:'https://server10.mp3quran.net/minsh',type:'surah'},
  {id:'abdulbasit',nameAr:'عبد الباسط عبد الصمد',nameEn:'Abdul Basit Abdul Samad',code:'abdulbasit',baseUrlTemplate:'https://server7.mp3quran.net/basit',type:'surah'},
  {id:'sudais',nameAr:'عبد الرحمن السديس',nameEn:'Abdurrahman As-Sudais',code:'sudais',baseUrlTemplate:'https://server11.mp3quran.net/sds',type:'surah'},
  {id:'shuraim',nameAr:'سعود الشريم',nameEn:'Saud Al-Shuraim',code:'shuraim',baseUrlTemplate:'https://server7.mp3quran.net/shur',type:'surah'},
  {id:'mahermuaiqly',nameAr:'ماهر المعيقلي',nameEn:'Maher Al-Muaiqly',code:'mahermuaiqly',baseUrlTemplate:'https://server12.mp3quran.net/maher',type:'surah'},
  {id:'ghamdi',nameAr:'سعد الغامدي',nameEn:'Saad Al-Ghamdi',code:'ghamdi',baseUrlTemplate:'https://server7.mp3quran.net/s_gmd',type:'surah'},
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
  {id:'b3',bookId:'bukhari',hadithNumber:'3',textAr:'من سلك طريقا يلتمس فيه علما سهل الله له به طريقا إلى الجنة',narrator:'أبو هريرة رضي الله عنه',grade:'صحيح',chapter:'العلم',ref:'bukhari:3'},
  {id:'b4',bookId:'bukhari',hadithNumber:'4',textAr:'خيركم من تعلم القرآن وعلمه',narrator:'عثمان بن عفان رضي الله عنه',grade:'صحيح',chapter:'فضائل القرآن',ref:'bukhari:4'},
  {id:'m1',bookId:'muslim',hadithNumber:'1',textAr:'الدين النصيحة، قلنا: لمن؟ قال: لله ولكتابه ولرسوله ولأئمة المسلمين وعامتهم',narrator:'تميم الداري رضي الله عنه',grade:'صحيح',chapter:'الإيمان',ref:'muslim:1'},
];

export type Prophet={id:string;nameAr:string;nameEn:string;slug:string;order:number;bioAr:string;bioEn?:string};
export const prophets:Prophet[]=[
  {id:'1',nameAr:'آدم عليه السلام',nameEn:'Adam',slug:'adam',order:1,bioAr:'أول الأنبياء والمرسلين، خليفة الله في الأرض'},
  {id:'2',nameAr:'نوح عليه السلام',nameEn:'Noah',slug:'noah',order:2,bioAr:'دعا قومه ألف سنة إلا خمسين سنة'},
  {id:'3',nameAr:'إبراهيم عليه السلام',nameEn:'Abraham',slug:'abraham',order:3,bioAr:'خليل الله، بنى الكعبة مع ابنه إسماعيل'},
  {id:'4',nameAr:'موسى عليه السلام',nameEn:'Moses',slug:'moses',order:4,bioAr:'كليم الله، أنقذ بني إسرائيل من فرعون'},
  {id:'5',nameAr:'عيسى عليه السلام',nameEn:'Jesus',slug:'jesus',order:5,bioAr:'روح الله وكلمته، أرسل إلى بني إسرائيل'},
  {id:'6',nameAr:'يوسف عليه السلام',nameEn:'Yusuf',slug:'yusuf',order:6,bioAr:'صاحب قصة الصبر والعفة، ملك مصر'},
  {id:'7',nameAr:'أيوب عليه السلام',nameEn:'Ayyub',slug:'ayyub',order:7,bioAr:'ضرب به المثل في الصبر على البلاء'},
  {id:'8',nameAr:'محمد صلى الله عليه وسلم',nameEn:'Muhammad',slug:'muhammad',order:8,bioAr:'خاتم الأنبياء والمرسلين، أرسل ��حمة للعالمين'},
];

export type Tawasheeh={id:string;titleAr:string;titleEn:string;artistAr:string;artistEn:string;audioUrl:string;duration:number;views:number;featured:boolean};
export const tawasheeh:Tawasheeh[]=[
  {id:'1',titleAr:'مولاي إني ببابك',titleEn:'Mawlay',artistAr:'سيد النقشبندي',artistEn:'Sayed Al-Naqshbandi',audioUrl:'https://example.com/audio/naqshbandi-mawlay.mp3',duration:320,views:15000,featured:true},
  {id:'2',titleAr:'قمر سيدنا النبي',titleEn:'Qamar',artistAr:'مصطفى عاطف',artistEn:'Mostafa Atef',audioUrl:'https://example.com/audio/qamar.mp3',duration:255,views:12000,featured:true},
  {id:'3',titleAr:'يا نور الله',titleEn:'Ya Noor Allah',artistAr:'فريق التواشيح',artistEn:'Tawasheeh Team',audioUrl:'https://example.com/audio/ya-noor.mp3',duration:272,views:18000,featured:false},
  {id:'4',titleAr:'سلام عليك',titleEn:'Assalam Alayak',artistAr:'الفنان المشهور',artistEn:'Famous Artist',audioUrl:'https://example.com/audio/assalam.mp3',duration:315,views:8300,featured:false},
  {id:'5',titleAr:'يا إلهي',titleEn:'Ya Ilahi',artistAr:'فريق التواشيح',artistEn:'Tawasheeh Team',audioUrl:'https://example.com/audio/ya-ilahi.mp3',duration:225,views:15200,featured:true},
  {id:'6',titleAr:'سبحان الله',titleEn:'Subhan Allah',artistAr:'المنشد الموهوب',artistEn:'Talented Singer',audioUrl:'https://example.com/audio/subhan.mp3',duration:150,views:9800,featured:false},
  {id:'7',titleAr:'الحمد لله',titleEn:'Al-Hamdu Lillah',artistAr:'فريق التواشيح',artistEn:'Tawasheeh Team',audioUrl:'https://example.com/audio/alhamdu.mp3',duration:200,views:11400,featured:true},
];
