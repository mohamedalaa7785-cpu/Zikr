-- Migration: Seed real Islamic content into empty content tables
-- Generated: 2024-07-05
-- NOTE: ALTER TYPE ... ADD VALUE must run outside a transaction block.

-- ────────────────────────────────────────────────────────────────
-- Extend the stories category enum with Islamic categories used by the app UI
-- ────────────────────────────────────────────────────────────────
-- NOTE: The 'category' enum is created in 20240705000001_create_category_type.sql.
-- The ALTER TYPE statements were removed because the enum is now created with the required values.

-- ────────────────────────────────────────────────────────────────
-- Scholars
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.scholars (slug, name_ar, name_en, bio_ar, bio_en, published) VALUES
('ibn-taymiyyah', 'شيخ الإسلام ابن تيمية', 'Ibn Taymiyyah',
 'أحمد بن عبد الحليم بن تيمية الحراني (661-728هـ)، شيخ الإسلام وأحد أعظم علماء الأمة. برع في الفقه والحديث والعقي[...]
 'Ahmad ibn Abd al-Halim ibn Taymiyyah (1263-1328 CE), a renowned Islamic scholar and theologian known for his works in jurisprudence, hadith, and creed.', true),
('ibn-qayyim', 'ابن القيم الجوزية', 'Ibn Qayyim Al-Jawziyyah',
 'محمد بن أبي بكر بن أيوب (691-751هـ)، تلميذ ابن تيمية النجيب، ومن أعظم علماء الإسلام في التزكية والسلوك والفقه. �[...]
 'A prominent Islamic jurist and theologian, the most famous student of Ibn Taymiyyah, known for works on spirituality and jurisprudence.', true),
('nawawi', 'الإمام النووي', 'Imam An-Nawawi',
 'يحيى بن شرف النووي (631-676هـ)، محدث وفقيه شافعي، صاحب الأربعين النووية ورياض الصالحين وشرح صحيح مسلم. من أكثر [...]
 'Yahya ibn Sharaf al-Nawawi, a leading Shafi''i hadith scholar, author of the famous Forty Hadith and Riyad al-Salihin.', true),
('ibn-baz', 'الشيخ عبد العزيز بن باز', 'Sheikh Ibn Baz',
 'عبد العزيز بن عبد الله بن باز (1330-1420هـ)، المفتي العام للمملكة العربية السعودية ورئيس هيئة كبار العلماء، من �[...]
 'The former Grand Mufti of Saudi Arabia, one of the most influential contemporary scholars of jurisprudence and hadith.', true),
('uthaymin', 'الشيخ محمد بن صالح العثيمين', 'Sheikh Ibn Uthaymin',
 'محمد بن صالح العثيمين (1347-1421هـ)، من أبرز علماء المملكة العربية السعودية، له شروحات قيمة في الفقه والعقيدة، [...]
 'A prominent Saudi scholar renowned for his accessible teaching style and detailed explanations of jurisprudence and creed.', true),
('albani', 'الشيخ محمد ناصر الدين الألباني', 'Sheikh Al-Albani',
 'محمد ناصر الدين الألباني (1332-1420هـ)، محدث العصر، صحح وضعّف آلاف الأحاديث وله جهود عظيمة في خدمة السنة النبوي[...]
 'A leading hadith scholar of the 20th century, known for his extensive work authenticating and classifying prophetic traditions.', true),
('shaarawi', 'الشيخ محمد متولي الشعراوي', 'Sheikh Al-Shaarawi',
 'محمد متولي الشعراوي (1911-1998م)، من أشهر المفسرين المعاصرين، له خواطر في تفسير القرآن الكريم انتشرت في العالم [...]
 'A famous Egyptian preacher and Quran exegete whose televised reflections reached millions across the Arab world.', true),
('saadi', 'الشيخ عبد الرحمن السعدي', 'Sheikh As-Saadi',
 'عبد الرحمن بن ناصر السعدي (1307-1376هـ)، عالم ومفسر، صاحب تفسير تيسير الكريم الرحمن المعروف بتفسير السعدي، من أ[...]
 'A scholar and exegete, author of the widely-used and accessible Tafsir al-Sa''di.', true)
ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────────
-- Companions (Sahaba)
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.companions (slug, name_ar, name_en, bio_ar, bio_en, category, order_num, published) VALUES
('abu-bakr', 'أبو بكر الصديق', 'Abu Bakr As-Siddiq',
 'عبد الله بن أبي قحافة، أول الخلفاء الراشدين، ورفيق النبي صلى الله عليه وسلم في الهجرة، وأول من آمن من الرجا[...]
 'The first Caliph, closest companion of the Prophet, and the first adult male to embrace Islam.', 'khulafa', 1, true),
('umar-ibn-khattab', 'عمر بن الخطاب', 'Umar ibn Al-Khattab',
 'الفاروق، ثاني الخلفاء الراشدين، اتسعت في عهده الفتوحات الإسلامية، واشتهر بعدله وقوته في الحق. أسلم فأعزّ �[...]
 'The second Caliph, known as Al-Faruq, renowned for his justice and the great expansion of Islam during his reign.', 'khulafa', 2, true),
('uthman-ibn-affan', 'عثمان بن عفان', 'Uthman ibn Affan',
 'ذو النورين، ثالث الخلفاء الراشدين، جمع القرآن في مصحف واحد، واشتهر بحيائه وكرمه وإنفاقه في سبيل الله.',
 'The third Caliph, known for compiling the Quran into a single standardized text, famed for his modesty and generosity.', 'khulafa', 3, true),
('ali-ibn-abi-talib', 'علي بن أبي طالب', 'Ali ibn Abi Talib',
 'ابن عم النبي صلى الله عليه وسلم وزوج ابنته فاطمة، رابع الخلفاء الراشدين، وأول من أسلم من الصبيان، اشتهر بع�[...]
 'The cousin and son-in-law of the Prophet, the fourth Caliph, known for his knowledge and courage.', 'khulafa', 4, true),
('khalid-ibn-walid', 'خالد بن الوليد', 'Khalid ibn Al-Walid',
 'سيف الله المسلول، قائد عسكري فذّ لم يُهزم في معركة قط، قاد جيوش المسلمين في فتوحات عظيمة في العراق والشام.',
 'The undefeated military commander known as "The Drawn Sword of Allah", who led major Islamic conquests.', 'qada', 5, true),
('bilal-ibn-rabah', 'بلال بن رباح', 'Bilal ibn Rabah',
 'مؤذن رسول الله صلى الله عليه وسلم، صحابي جليل عُذّب في سبيل إيمانه فصبر، وكان صوته يصدح بالأذان في المدينة.[...]
 'The first muezzin of Islam, who endured torture for his faith and whose call to prayer echoed in Madinah.', 'sabiqun', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────────
-- Battles (Ghazawat)
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.battles (slug, name_ar, name_en, description_ar, description_en, date_hijri, date_gregorian, location_ar, location_en, order_num, published) VALUES
('badr', 'غزوة بدر الكبرى', 'Battle of Badr',
 'أول معركة فاصلة في تاريخ الإسلام، انتصر فيها المسلمون على قريش رغم قلة عددهم، وسمّاها الله يوم الفرقان. كا�[...]
 'The first decisive battle in Islamic history where the outnumbered Muslims defeated the Quraysh.', '2 هـ', '624 م', 'بدر قرب المدينة', 'Badr, near Madinah', 1, true),
('uhud', 'غزوة أحد', 'Battle of Uhud',
 'معركة وقعت قرب جبل أحد، ابتُلي فيها المسلمون بعد مخالفة الرماة لأمر النبي صلى الله عليه وسلم، واستُشهد فيه[...]
 'A battle near Mount Uhud where Muslims faced hardship after the archers left their positions.', '3 هـ', '625 م', 'جبل أحد', 'Mount Uhud', 2, true),
('khandaq', 'غزوة الخندق (الأحزاب)', 'Battle of the Trench',
 'حاصرت الأحزاب المدينة، فحفر المسلمون خندقاً بمشورة سلمان الفارسي، فردّ الله الأحزاب بريح وجنود لم يروها د[...]
 'The confederates besieged Madinah, but the Muslims dug a trench and Allah repelled the enemy.', '5 هـ', '627 م', 'المدينة المنورة', 'Madinah', 3, true),
('khaybar', 'غزوة خيبر', 'Battle of Khaybar',
 'فتح المسلمون حصون خيبر اليهودية، وكان فتحاً عظيماً مكّن للمسلمين وأمّن جبهتهم الشمالية.',
 'The Muslims conquered the fortresses of Khaybar, securing their northern frontier.', '7 هـ', '628 م', 'خيبر', 'Khaybar', 4, true),
('hunayn', 'غزوة حنين', 'Battle of Hunayn',
 'وقعت بعد فتح مكة، أُعجب فيها المسلمون بكثرتهم فلم تغنِ عنهم شيئاً في البداية، ثم ثبّت الله المؤمنين ونصرهم[...]
 'Fought after the conquest of Makkah; the Muslims were initially tested before Allah granted them victory.', '8 هـ', '630 م', 'وادي حنين', 'Valley of Hunayn', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────────
-- Conquests (Futuhat)
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.conquests (slug, name_ar, name_en, description_ar, description_en, date_hijri, date_gregorian, location_ar, location_en, leader_ar, leader_en, order_num, published) VALUES
('makkah', 'فتح مكة', 'Conquest of Makkah',
 'دخل النبي صلى الله عليه وسلم مكة فاتحاً في عشرة آلاف من المسلمين دون قتال يُذكر، وعفا عن أهلها فدخل الناس ف�[...]
 'The peaceful conquest of Makkah by the Prophet, marked by his forgiveness of its people.', '8 هـ', '630 م', 'مكة المكرمة', 'Makkah', 'النبي محمد ﷺ', 'Prophet Muhammad ﷺ[...]
('quds', 'فتح بيت المقدس', 'Conquest of Jerusalem',
 'فُتحت بيت المقدس في عهد عمر بن الخطاب صلحاً، وتسلّم مفاتيحها بنفسه، وكتب لأهلها العهدة العمرية التي أمّنت�[...]
 'Jerusalem was peacefully surrendered to Caliph Umar, who granted its people the famous Covenant of Umar.', '15 هـ', '637 م', 'بيت المقدس', 'Jerusalem', 'عمر بن الخطاب', 'U[...]
('misr', 'فتح مصر', 'Conquest of Egypt',
 'فتح عمرو بن al-As conquered Egypt during Umar''s caliphate and founded the city of Fustat.', '20 هـ', '641 م', 'مصر', 'Egypt', 'عمرو بن العاص', 'Amr ibn Al-As', 3, true),
('andalus', 'فتح الأندلس', 'Conquest of Al-Andalus',
 'عبر طارق بن زياد المضيق وفتح الأندلس، فبدأت حضارة إسلامية زاهرة دامت قروناً وأثرت في أوروبا كلها.',
 'Tariq ibn Ziyad crossed the strait and conquered the Iberian Peninsula, beginning a flourishing civilization.', '92 هـ', '711 م', 'شبه الجزيرة الإيبيرية', 'Iberian Peninsu[...]
('constantinople', 'فتح القسطنطينية', 'Conquest of Constantinople',
 'فتح السلطان محمد الفاتح القسطنطينية عاصمة الدولة البيزنطية، محققاً بشارة النبي صلى الله عليه وسلم.',
 'Sultan Mehmed II conquered Constantinople, fulfilling the prophecy of the Prophet.', '857 هـ', '1453 م', 'القسطنطينية', 'Constantinople', 'محمد الفاتح', 'Mehmed the Conq[...]
ON CONFLICT (slug) DO NOTHING;
