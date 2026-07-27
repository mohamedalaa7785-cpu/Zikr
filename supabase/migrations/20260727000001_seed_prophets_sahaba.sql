-- ============================================================================
-- ZIKR MEDIA - SEED: PROPHETS & COMPANIONS
-- Date: 2026-07-27
-- Fully idempotent (ON CONFLICT DO NOTHING / DO UPDATE)
-- ============================================================================

-- ── PROPHETS ─────────────────────────────────────────────────────────────────

INSERT INTO public.prophets (id, name_ar, name_en, slug, order_num, bio_ar, bio_en, published, metadata)
SELECT
  id,
  name_ar,
  name_en,
  slug,
  order_number,
  story_ar,
  story_en,
  published,
  jsonb_build_object(
    'mentioned_in_quran', mentioned_in_quran,
    'summary_ar', summary_ar,
    'summary_en', summary_en,
    'miracles_ar', miracles_ar::jsonb,
    'miracles_en', miracles_en::jsonb,
    'lessons_ar', lessons_ar::jsonb,
    'lessons_en', lessons_en::jsonb
  )
FROM (VALUES
(
  gen_random_uuid(), 'آدم عليه السلام', 'Prophet Adam (AS)', 'adam',
  1, true,
  'أول البشر وأول الأنبياء، خلقه الله بيده ونفخ فيه من روحه.',
  'The first human and first prophet, created by Allah with His own hands.',
  'خلق الله آدم عليه السلام من تراب، وعلَّمه أسماء كل شيء، وأسجد له الملائكة كرامةً له. غرَّه إبليس فأكل من الشجرة المنهي عنها مع زوجه حواء، فأُهبطا إلى الأرض. تاب آدم وقبل الله توبته، وجعله خليفة في الأرض يعمرها ويعلِّم ذريته التوحيد. علَّم أبناءه الزراعة والحياة، وكان يُعلِّمهم الصلاة لله وحده. دفن في الجبل المقدس وفقاً للروايات، وهو أبو البشرية جمعاء.',
  'Allah created Adam from clay, taught him the names of all things, and commanded the angels to prostrate before him. Iblis refused out of arrogance and became the first rebel. Adam and Hawwa (Eve) were tempted and ate from the forbidden tree, so they were sent down to Earth. Adam repented sincerely and Allah accepted his repentance, making him the first Khalifah on Earth. He taught his children monotheism, farming, and worship.',
  '["تعليم الأسماء كلها", "خلقه الله بيده مباشرة", "سجود الملائكة له"]',
  '["Taught all names", "Created directly by Allah''s hands", "Angels prostrated before him"]',
  '["التوبة والإنابة إلى الله دائماً", "خطورة الكبر والمعصية", "الإنسان مُكرَّم ومستخلَف في الأرض"]',
  '["Always repent and return to Allah", "Arrogance and disobedience lead to ruin", "Man is honored and entrusted as a steward of Earth"]',
  true
),
(
  gen_random_uuid(), 'نوح عليه السلام', 'Prophet Nuh (AS)', 'nuh',
  2, true,
  'نبي الله نوح دعا قومه ألف سنة إلا خمسين عاماً فلم يؤمن إلا قليل.',
  'Prophet Nuh called his people for 950 years; only a few believed.',
  'أرسل الله نوحاً إلى قومه الذين أغرقوا في الشرك وعبادة الأصنام. دعاهم نوح ليلاً ونهاراً سراً وعلانيةً طوال 950 سنة، فلم يؤمن معه إلا القليل. أوحى الله إليه أن يصنع السفينة، فصنعها وأركب فيها المؤمنين وزوجين من كل حيوان. جاء الطوفان العظيم فأغرق الكافرين بمن فيهم ابن نوح الذي أبى أن يركب معه. استقرت السفينة على جبل الجودي، وبدأت حضارة جديدة من ذريته.',
  'Allah sent Nuh to a people drowned in idol worship. Nuh called them by night and day, secretly and openly for 950 years, yet only a small number believed. Allah commanded him to build the Ark. He loaded the believers and a pair from every animal. The Great Flood came and drowned all disbelievers, including Nuh''s own rebellious son. The Ark came to rest on Mount Judi and a new civilization began from his descendants.',
  '["السفينة العظيمة", "الطوفان الذي غطى الأرض", "إنجاؤه والمؤمنين معه"]',
  '["The great Ark", "The flood that covered the earth", "Salvation of believers with him"]',
  '["الصبر على الدعوة عقوداً طويلة", "القرابة لا تنفع بدون الإيمان", "الطاعة الكاملة لأوامر الله"]',
  '["Patience in calling to truth for decades", "Family ties without faith bring no benefit", "Complete obedience to Allah''s commands"]',
  true
),
(
  gen_random_uuid(), 'إبراهيم عليه السلام', 'Prophet Ibrahim (AS)', 'ibrahim',
  3, true,
  'خليل الله وأبو الأنبياء، بنى الكعبة المشرفة مع ابنه إسماعيل.',
  'The friend of Allah and father of prophets, he built the Kaabah with his son Ismail.',
  'وُلد إبراهيم في بابل وكسر أصنام قومه ليثبت لهم زيف معبوداتهم، فرموه في النار فجعلها الله بردًا وسلامًا عليه. هاجر إلى الشام ثم مصر ثم مكة حيث ترك زوجه هاجر وابنه إسماعيل الرضيع. جاءت معجزة زمزم وأصبح المكان عامراً بالناس. أُمر إبراهيم بذبح ابنه إسماعيل فبادر إلى الطاعة فافتُدي بكبش. بنى إبراهيم وإسماعيل الكعبة المشرفة ورفعا قواعدها، وأسس شعائر الحج التي تُؤدَّى إلى يوم القيامة.',
  'Ibrahim was born in Babylon and broke the idols of his people to prove the falsehood of their gods, so they threw him into a fire which Allah made cool and peaceful for him. He migrated to Sham, then Egypt, then Makkah where he left his wife Hajar and infant son Ismail. The miracle of Zamzam emerged and the place flourished. Allah commanded Ibrahim to sacrifice his son Ismail; he obeyed fully and a ram was sent as ransom. Ibrahim and Ismail built the Kaabah and established the rites of Hajj.',
  '["النار التي أصبحت برداً وسلاماً", "ذبح الابن وفداؤه بكبش", "نبع زمزم المعجزي", "بناء الكعبة"]',
  '["Fire becoming cool and peaceful", "Ram sent to ransom his son", "Miraculous spring of Zamzam", "Building the Kaabah"]',
  '["الإخلاص التام لله فوق كل اعتبار", "التوكل على الله في أشد الأوقات", "التضحية بأعز ما نملك في سبيل الله"]',
  '["Complete sincerity to Allah above all else", "Trusting Allah in the hardest moments", "Sacrificing what we love most for Allah"]',
  true
),
(
  gen_random_uuid(), 'إسماعيل عليه السلام', 'Prophet Ismail (AS)', 'ismail',
  4, true,
  'ذبيح الله الذي صبر على الابتلاء العظيم وبنى الكعبة مع أبيه إبراهيم.',
  'The patient one who endured the great trial and built the Kaabah with his father Ibrahim.',
  'وُلد إسماعيل لإبراهيم من زوجه هاجر، وتركه أبوه طفلاً رضيعاً في وادٍ غير ذي زرع بأمر الله. عندما نفد الماء سعت هاجر بين الصفا والمروة سبعة أشواط فنبع ماء زمزم. كبر إسماعيل ليصبح شاباً قوياً، وأُخبر والده برؤية ذبحه فقال ببساطة: "افعل ما تؤمر". قُدِّم الفداء بكبش وسلم كلاهما. بنى إبراهيم وإسماعيل الكعبة معاً ثم أرسله الله نبياً إلى قبيلة جُرهُم وبنى العرب.',
  'Ismail was born to Ibrahim from Hajar and was left as an infant in a dry valley by Allah''s command. When water ran out, Hajar ran between Safa and Marwa seven times and Zamzam sprang forth. Ismail grew into a strong youth; when his father told him of the vision of slaughter he simply said, "Do as you are commanded." A ram was sent as ransom and both were saved. Ibrahim and Ismail built the Kaabah together; Allah then sent Ismail as a prophet to the tribe of Jurhum and the Arabs.',
  '["الفداء بالكبش", "نبع زمزم", "بناء الكعبة"]',
  '["Ransom by ram", "Zamzam spring", "Building the Kaabah"]',
  '["الصبر والطاعة في أشد الأوقات", "الثقة بالله تُفضي إلى النجاة", "التضحية بالنفس في طاعة الله"]',
  '["Patience and obedience in the hardest moments", "Trust in Allah leads to salvation", "Self-sacrifice in Allah''s obedience"]',
  true
),
(
  gen_random_uuid(), 'يوسف عليه السلام', 'Prophet Yusuf (AS)', 'yusuf',
  5, true,
  'أحسن القصص في القرآن، من الجب إلى العرش.',
  'The most beautiful story in the Quran — from the pit to the throne.',
  'وُلد يوسف لنبي الله يعقوب وكان أحبَّ أبنائه إليه. حسده إخوته فألقوه في الجُبّ وأخبروا أباهم أن ذئباً أكله. بِيع رقيقاً في مصر لعزيزها فتيسَّر له الأمر، غير أن امرأة العزيز راودته عن نفسه فرفض فاتُّهم وسُجن. علَّمه الله تأويل الأحلام، فعبَّر حلم الملك وأصاب فأخرجه من السجن وجعله على خزائن الأرض. لما جاء إخوته طالبين القوت عرَفهم وخططَ حتى أحضروا أخاه بنيامين، ثم انكشف أمره وقال لهم: "لا تثريب عليكم اليوم". اجتمع الشمل بعد سنوات وتحقق الرؤيا التي رآها صغيراً.',
  'Yusuf was born to Prophet Yaqub and was his most beloved son. His brothers envied him, threw him into a well, and told their father a wolf had eaten him. He was sold into slavery in Egypt to its chief minister, and flourished there, but the minister''s wife tried to seduce him; he refused and was imprisoned on a false charge. Allah taught him dream interpretation; he interpreted the king''s dream correctly and was released, made overseer of Egypt''s treasuries. When his brothers came seeking food he recognized them, planned until they brought his brother Binyamin, then revealed himself saying, "No blame upon you today." The family was reunited, fulfilling the childhood dream.',
  '["تأويل الأحلام", "الخروج من السجن بتأويل حلم الملك", "لمسُّ قميصه أعاد البصر ليعقوب"]',
  '["Dream interpretation", "Released from prison by interpreting the king''s dream", "His shirt restoring Yaqub''s sight"]',
  '["الصبر على البلاء يُفضي إلى الفرج", "الأخلاق الحسنة تحمي في أشد المواقف", "العفو عند المقدرة خُلُق الأنبياء"]',
  '["Patience in hardship leads to relief", "Good character protects in the hardest situations", "Forgiveness at the moment of power is the prophets'' way"]',
  true
),
(
  gen_random_uuid(), 'موسى عليه السلام', 'Prophet Musa (AS)', 'musa',
  6, true,
  'كليم الله الذي أنجى بني إسرائيل من فرعون وأنزل الله عليه التوراة.',
  'The one who spoke to Allah directly, saved the Israelites from Pharaoh, and received the Torah.',
  'وُلد موسى في وقت أباد فيه فرعون أبناء بني إسرائيل، فألهمت أمه أن تضعه في صندوق وتُلقيه في النيل. التقطه آل فرعون وربته أمه نفسها مرضعةً. كبر في قصر فرعون، ثم قتل رجلاً خطأً فهرب إلى مدين حيث تزوج وأتقن الرعي. عند شجرة الوادي المقدس كلَّمه الله مباشرةً وبعثه لفرعون. أُيِّد بتسع آيات بيِّنات منها تحويل عصاه ثعباناً ويده بيضاء. لما أبى فرعون أرسل الله الآفات على مصر حتى أذن له بالخروج. شقَّ الله له البحر فعبره بنو إسرائيل وغرق فرعون وجنوده. أنزل الله عليه التوراة في طور سيناء وكلَّمه تكليماً.',
  'Musa was born when Pharaoh was slaughtering Israelite boys. His mother was inspired to place him in a basket on the Nile. Pharaoh''s family took him in and his own mother nursed him. He grew up in Pharaoh''s palace, then accidentally killed a man and fled to Madyan where he married and shepherded. At the sacred valley, Allah spoke to him directly and sent him to Pharaoh with nine clear signs including his staff turning into a serpent and his hand turning white. When Pharaoh refused, plagues struck Egypt until he let the Israelites go. Allah split the sea, the Israelites crossed, and Pharaoh and his army drowned. Allah gave Musa the Torah on Mount Sinai and spoke to him directly.',
  '["العصا التي تحولت ثعباناً وشقت البحر", "اليد البيضاء", "تسع آيات", "الكلام المباشر مع الله", "إنزال التوراة"]',
  '["Staff turning into a serpent and splitting the sea", "Glowing white hand", "Nine signs", "Direct speech with Allah", "Receiving the Torah"]',
  '["الشجاعة في مواجهة الطغيان", "الثقة بالله وقت الخطر", "القيادة تحتاج صبراً على الأقوام الضعيفة"]',
  '["Courage in facing tyranny", "Trust in Allah in moments of danger", "Leadership requires patience with difficult people"]',
  true
),
(
  gen_random_uuid(), 'عيسى عليه السلام', 'Prophet Isa (AS)', 'isa',
  7, true,
  'روح الله وكلمته، وُلد من غير أب وأُيِّد بمعجزات عظيمة.',
  'The spirit and word of Allah, born without a father and supported with great miracles.',
  'وُلد عيسى لمريم العذراء البتول بكلمة من الله "كن فيكون". تكلَّم في المهد دفاعاً عن أمه. شبَّ يدعو إلى الله ويُعلِّم الإنجيل. أيَّده الله بمعجزات عظيمة: يُبرئ الأكمَه والأبرص ويُحيي الموتى بإذن الله. أيَّده الله بروح القُدُس. رفع الله عيسى إليه حين تآمر عليه اليهود ولم يُصلَب، بل رُفع حياً وسيعود آخر الزمان ليكسر الصليب ويقتل الخنزير ويملأ الأرض عدلاً.',
  'Isa was born to the Virgin Maryam by the word "Be" from Allah. He spoke in the cradle in defense of his mother. He grew up calling to Allah and teaching the Injil. Allah supported him with great miracles: curing the blind, healing lepers, and raising the dead by Allah''s permission. He was supported by the Holy Spirit. When the Jews plotted against him, Allah raised Isa to Himself — he was not crucified. He will return at the end of times to break the cross, kill the pig, and fill the earth with justice.',
  '["الكلام في المهد", "إحياء الموتى", "إبراء الأكمه والأبرص", "خلق طيراً من الطين", "الرفع إلى السماء"]',
  '["Speaking in the cradle", "Raising the dead", "Curing blindness and leprosy", "Creating a bird from clay", "Raised alive to heaven"]',
  '["الاعتزاز بالهوية الإسلامية", "معرفة الحق من الباطل في قضية الصلب", "القرآن هو المصدر الحق لقصة عيسى"]',
  '["Pride in Islamic identity", "Knowing truth from falsehood on the crucifixion", "The Quran is the true source for the story of Isa"]',
  true
),
(
  gen_random_uuid(), 'محمد صلى الله عليه وسلم', 'Prophet Muhammad (SAW)', 'muhammad',
  25, true,
  'خاتم الأنبياء والمرسلين، رحمة الله للعالمين، أشرف الخلق وأكملهم.',
  'The seal of all prophets, Allah''s mercy to all worlds, the most noble of creation.',
  'وُلد النبي محمد ﷺ عام الفيل في مكة المكرمة يتيماً فكفله جده عبد المطلب ثم عمه أبو طالب. نشأ أميناً صادقاً اشتُهر بالأمانة والصدق حتى لُقِّب بالأمين. تزوج خديجة رضي الله عنها وكانت أول من آمن به. في سن الأربعين نزل عليه الوحي في غار حراء "اقرأ" فكانت بداية الرسالة. دعا إلى التوحيد سراً ثلاث سنوات ثم علانيةً فآذاه قريش وعذَّبوا أصحابه. أُسري به من المسجد الحرام إلى المسجد الأقصى ثم عُرج به إلى السموات العلى. هاجر إلى المدينة وأسَّس الدولة الإسلامية وغزا الغزوات وفتح مكة. توفي ﷺ بعد أن أكمل الله الدين وأتمَّ النعمة، وتركنا القرآن والسنة الشريفة.',
  'The Prophet Muhammad ﷺ was born in Makkah, the Year of the Elephant, an orphan raised by his grandfather Abd al-Muttalib then uncle Abu Talib. He grew up as the most honest and trustworthy person and was called "Al-Amin" (The Trustworthy). He married Khadijah, the first to believe in him. At 40, revelation came to him in Cave Hira — "Read!" — beginning the mission. He called to monotheism secretly for three years, then openly; Quraysh persecuted him and his companions. He was taken on the Night Journey from Masjid al-Haram to al-Aqsa then ascended through the heavens. He migrated to Madinah, established the Islamic state, fought expeditions, and conquered Makkah. He passed away after Allah completed the religion, leaving us the Quran and Sunnah.',
  '["القرآن الكريم المعجزة الخالدة", "الإسراء والمعراج", "الهجرة النبوية", "فتح مكة", "الشق على القمر", "نبع الماء من بين أصابعه"]',
  '["The eternal miracle of the Quran", "The Night Journey and Ascension", "The Prophetic Migration", "Conquest of Makkah", "Splitting of the moon", "Water flowing from his fingers"]',
  '["محبة النبي ﷺ وتطبيق سنته", "الصبر على الأذى في سبيل الدعوة", "الشمائل المحمدية مثل أعلى للمسلم"]',
  '["Love for the Prophet ﷺ and following his Sunnah", "Patience in enduring harm for the sake of the call", "The Prophet''s character is the highest example for every Muslim"]',
  true
)
 ) AS seed(id, name_ar, name_en, slug, order_number, mentioned_in_quran, summary_ar, summary_en, story_ar, story_en, miracles_ar, miracles_en, lessons_ar, lessons_en, published)
ON CONFLICT (slug) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  order_num = EXCLUDED.order_num,
  bio_ar = EXCLUDED.bio_ar,
  bio_en = EXCLUDED.bio_en,
  metadata = EXCLUDED.metadata,
  published = EXCLUDED.published;

-- ── COMPANIONS (SAHABA) ───────────────────────────────────────────────────────

INSERT INTO public.companions (id, name_ar, name_en, slug, title_ar, category, death_year, bio_ar, bio_en, published, metadata)
SELECT
  id,
  name_ar,
  name_en,
  slug,
  title_ar,
  category,
  death_year::text,
  story_ar,
  story_en,
  published,
  jsonb_build_object(
    'title_en', title_en,
    'birth_year', birth_year,
    'summary_ar', summary_ar,
    'summary_en', summary_en,
    'virtues_ar', virtues_ar::jsonb,
    'virtues_en', virtues_en::jsonb
  )
FROM (VALUES
(
  gen_random_uuid(), 'أبو بكر الصديق', 'Abu Bakr Al-Siddiq', 'abu-bakr',
  'الصديق', 'The Truthful', 'khulafa',
  573, 634,
  'أفضل الصحابة وأول الخلفاء الراشدين، صاحب النبي ﷺ في الغار وفي الهجرة.',
  'The best of companions and first of the Rightly Guided Caliphs, companion of the Prophet ﷺ in the cave and migration.',
  'أسلم أبو بكر مبكراً وكان أفضل الصحابة بشهادة النبي ﷺ. صاحب النبي ﷺ في رحلة الهجرة المباركة واختبأ معه في غار ثور ثلاثة أيام. قال له النبي ﷺ حين خاف: "لا تحزن إن الله معنا". كان أكثر الصحابة إنفاقاً في سبيل الله حتى قال له النبي: "ما نفعني مال أحد مثل ما نفعني مال أبي بكر". أعتق بلالاً وعدداً من المستضعفين. بعد وفاة النبي ﷺ تولى الخلافة وحارب المرتدين وجمع القرآن في مصحف وأرسل الجيوش لفتح الشام والعراق. حكم سنتين وثلاثة أشهر وتوفي راضياً مرضياً.',
  'Abu Bakr embraced Islam early and was the best of companions by the Prophet''s own testimony. He accompanied the Prophet ﷺ on the blessed migration and hid with him in Cave Thawr for three days. When Abu Bakr feared, the Prophet told him: "Do not grieve, indeed Allah is with us." He was the most generous companion in spending for Allah''s sake, prompting the Prophet to say no one''s wealth benefited him like Abu Bakr''s. He freed Bilal and other enslaved believers. After the Prophet''s death, he became caliph, fought the apostates, initiated the compilation of the Quran, and dispatched armies to open Sham and Iraq. He ruled for two years and three months.',
  '["صاحب النبي ﷺ في الغار", "أفضل الأمة بعد النبي", "جمع القرآن الكريم", "مواجهة حروب الردة بحزم"]',
  '["Companion of the Prophet ﷺ in the cave", "Best of the ummah after the Prophet", "Initiated compilation of the Quran", "Firmly confronted the apostasy wars"]',
  true
),
(
  gen_random_uuid(), 'عمر بن الخطاب', 'Umar ibn al-Khattab', 'umar-ibn-khattab',
  'الفاروق', 'Al-Faruq (The Distinguisher)', 'khulafa',
  584, 644,
  'ثاني الخلفاء الراشدين، الذي أعزَّ الله به الإسلام وفتحت في عهده بلاد الشام ومصر وفارس.',
  'The second Rightly Guided Caliph in whose era Sham, Egypt, and Persia were opened.',
  'كان عمر من أشد الناس على المسلمين قبل إسلامه ثم صار من أعزهم. أسلم بعد قصة مشهورة تتعلق بسماعه أخته تتلو القرآن. قال النبي ﷺ: "اللهم أعز الإسلام بأحد العمرين". في خلافته فتح المسلمون بيت المقدس والعراق ومصر وفارس. اشتُهر بعدله الشديد حتى قيل "عدل عمر" مثلاً. وضع التقويم الهجري وأسس ديوان العطاء ونظام الشرطة. استُشهد بسيف أبي لؤلؤة المجوسي في صلاة الفجر.',
  'Umar was one of the fiercest opponents of Muslims before his Islam then became one of their greatest. He embraced Islam after a famous incident of hearing his sister recite the Quran. The Prophet ﷺ said: "O Allah, honor Islam with one of the two Umars." During his caliphate, Muslims opened Jerusalem, Iraq, Egypt, and Persia. He was renowned for his strict justice, making "the justice of Umar" proverbial. He established the Hijri calendar, the treasury, and the police system. He was martyred by Abu Lu''lu the Persian while leading Fajr prayer.',
  '["عدله الشهير", "فتح بيت المقدس", "وضع التقويم الهجري", "استشهاده في المحراب"]',
  '["His legendary justice", "Opening Jerusalem", "Establishing the Hijri calendar", "Martyrdom at the prayer niche"]',
  true
),
(
  gen_random_uuid(), 'عثمان بن عفان', 'Uthman ibn Affan', 'uthman-ibn-affan',
  'ذو النورين', 'The One with Two Lights', 'khulafa',
  576, 656,
  'ثالث الخلفاء الراشدين، تزوج بنتَي النبي ﷺ وجمع القرآن في مصحف واحد.',
  'Third Rightly Guided Caliph who married two daughters of the Prophet ﷺ and unified the Quran.',
  'أسلم عثمان مبكراً وهاجر الهجرتين. تزوج رقية ثم أم كلثوم بنتي النبي ﷺ فلُقِّب بذي النورين. اشتُهر بكرمه الشديد حيث جهَّز جيش العسرة وحفر بئر رومة للمسلمين. في خلافته اتسعت الفتوحات وامتدت من المغرب إلى خراسان. أهم إنجازاته جمع القرآن في مصحف واحد موحَّد لتفادي الاختلاف. استُشهد في داره وهو يقرأ القرآن.',
  'Uthman embraced Islam early and made both migrations. He married Ruqayya then Umm Kulthum, daughters of the Prophet ﷺ, earning the title "He of Two Lights." He was known for extraordinary generosity, equipping the Army of Hardship and digging the Bir Rumah well. During his caliphate conquests extended from Morocco to Khorasan. His greatest achievement was compiling the Quran into one unified copy. He was martyred in his home while reading the Quran.',
  '["تجهيز جيش العسرة", "توحيد المصحف", "الزواج من بنتي النبي", "الاستشهاد وهو يقرأ القرآن"]',
  '["Equipping the Army of Hardship", "Unifying the Quran", "Marrying the Prophet''s two daughters", "Martyrdom while reading the Quran"]',
  true
),
(
  gen_random_uuid(), 'علي بن أبي طالب', 'Ali ibn Abi Talib', 'ali-ibn-abi-talib',
  'أمير المؤمنين', 'Commander of the Faithful', 'khulafa',
  600, 661,
  'رابع الخلفاء الراشدين وابن عم النبي ﷺ وزوج فاطمة الزهراء، باب مدينة العلم.',
  'Fourth Rightly Guided Caliph, cousin and son-in-law of the Prophet ﷺ, gate of the city of knowledge.',
  'أسلم علي وهو صبي صغير وكان أول الصبيان إسلاماً. رباه النبي ﷺ في بيته وزوَّجه ابنته فاطمة الزهراء. اشتُهر بفروسيته وشجاعته في الغزوات كان لواء النبي في أحد وبدر وخيبر. قال النبي ﷺ: "أنا مدينة العلم وعلي بابها". في خلافته مرَّت الأمة بأزمات كبرى كمعركة الجمل وصفين. استُشهد بسيف ابن ملجم خارجاً لصلاة الفجر.',
  'Ali embraced Islam as a young boy, being the first youth to do so. The Prophet ﷺ raised him in his home and married him to his daughter Fatimah al-Zahra. He was renowned for his valor in battles, carrying the Prophet''s banner at Uhud, Badr, and Khaybar. The Prophet ﷺ said: "I am the city of knowledge and Ali is its gate." During his caliphate, major crises arose including the battles of the Camel and Siffin. He was martyred by Ibn Muljam''s sword as he went to Fajr prayer.',
  '["أول الصبيان إسلاماً", "باب مدينة العلم", "بطولة خيبر وأحد", "زواجه من فاطمة الزهراء"]',
  '["First youth to embrace Islam", "Gate of the city of knowledge", "Hero of Khaybar and Uhud", "Marriage to Fatimah al-Zahra"]',
  true
),
(
  gen_random_uuid(), 'خديجة بنت خويلد', 'Khadijah bint Khuwaylid', 'khadijah',
  'أم المؤمنين', 'Mother of the Believers', 'mothers',
  555, 619,
  'أول من آمن بالنبي ﷺ وأول أمهات المؤمنين، وقفت إلى جانب النبي في أصعب لحظاته.',
  'The first to believe in the Prophet ﷺ and the first of the Mothers of the Believers, standing by him in his hardest moments.',
  'كانت خديجة سيدة شريفة كريمة عُرفت بعقلها وشرفها. تزوجت النبي ﷺ وكانت أول من آمن به من كل البشر. حين جاء النبي من غار حراء مرتجفاً قالت له: "كلا والله لا يخزيك الله أبداً، إنك لتصل الرحم وتحمل الكَلَّ وتكسب المعدوم وتُقري الضيف وتُعين على نوائب الحق". أنفقت كل مالها في سبيل الدعوة. ولدت للنبي بناته وكان حزنه عليها شديداً حتى سُمِّيَ عام وفاتها وأبي طالب "عام الحزن".',
  'Khadijah was a noble and generous lady known for her wisdom and integrity. She married the Prophet ﷺ and was the very first person to believe in him. When the Prophet came from Cave Hira trembling, she consoled him: "By Allah, He will never disgrace you — you maintain family ties, bear burdens, earn for the poor, honor guests, and support those in need of justice." She spent all her wealth for the sake of the mission. She bore the Prophet''s daughters, and his grief at her death was so great that it and Abu Talib''s death named that year "the Year of Sorrow."',
  '["أول من آمن بالنبي", "دعمها المطلق في أصعب اللحظات", "بشَّرها النبي ﷺ ببيت في الجنة"]',
  '["First to believe in the Prophet", "Absolute support in his hardest moments", "The Prophet gave her glad tidings of a house in Paradise"]',
  true
),
(
  gen_random_uuid(), 'عائشة بنت أبي بكر', 'Aisha bint Abi Bakr', 'aisha',
  'أم المؤمنين', 'Mother of the Believers', 'mothers',
  613, 678,
  'المحدِّثة الكبرى وأعلم نساء أمة محمد ﷺ، رويت عنها الآلاف من الأحاديث.',
  'The great hadith scholar and most knowledgeable woman of the ummah of Muhammad ﷺ.',
  'تزوجها النبي ﷺ وكانت من أحب أزواجه إليه. اشتُهرت بفطنتها وعلمها الغزير. أكثر الصحابة رواية للحديث حيث روت أكثر من 2200 حديث. كانت المرجع الأول للصحابة في أحكام الدين لا سيما ما يخص أحوال النبي ﷺ في بيته. كانت شاعرة أديبة فصيحة وعُرفت بجرأتها في الدفاع عن السنة وتصحيح الأخطاء.',
  'The Prophet ﷺ married her and she was among his most beloved wives. She was renowned for her keen intelligence and vast knowledge. She is among the most prolific hadith narrators with over 2200 hadiths. She was the primary reference for companions on religious rulings, especially regarding the Prophet''s ﷺ conduct at home. She was a poet, literary figure, and eloquent speaker known for her boldness in defending the Sunnah.',
  '["أكثر الصحابيات رواية للحديث", "مرجع الصحابة في أحوال النبي", "الدفاع الجريء عن السنة"]',
  '["Most prolific female hadith narrator", "Reference for companions on the Prophet''s personal conduct", "Bold defender of the Sunnah"]',
  true
),
(
  gen_random_uuid(), 'بلال بن رباح', 'Bilal ibn Rabah', 'bilal',
  'مؤذن النبي', 'Muezzin of the Prophet', 'early',
  580, 640,
  'أول مؤذن في الإسلام، الذي صبر على أشد العذاب لأجل لا إله إلا الله.',
  'The first muezzin in Islam, who endured the worst torture for the sake of "There is no god but Allah."',
  'كان بلال عبداً حبشياً لأمية بن خلف الذي عذَّبه بالحجارة تحت شمس مكة الحارقة ليترك الإسلام. ظل يردد "أحد أحد". اشتراه أبو بكر الصديق وأعتقه. اختاره النبي ﷺ ليكون أول مؤذن في الإسلام. صعد على الكعبة يوم فتح مكة وأذَّن فأبكى الحاضرين. بعد وفاة النبي ﷺ امتنع عن الأذان من الحزن إلا مرة واحدة في دمشق فأبكى جموع المسلمين.',
  'Bilal was an Abyssinian slave whose master Umayyah ibn Khalaf tortured him with burning rocks under the Makkan sun to make him renounce Islam. He kept saying "Ahad, Ahad" (One, One). Abu Bakr bought and freed him. The Prophet ﷺ chose him to be the first muezzin in Islam. On the day of the conquest of Makkah, he climbed the Kaabah and gave the adhan, moving everyone to tears. After the Prophet''s death, he refrained from giving adhan out of grief, except once in Damascus which made the Muslim crowds weep.',
  '["أول مؤذن في الإسلام", "الأذان على الكعبة يوم الفتح", "الصبر على عذاب قريش بلا تزعزع"]',
  '["First muezzin in Islam", "Adhan on the Kaabah at the Conquest", "Enduring Quraysh''s torture unwaveringly"]',
  true
),
(
  gen_random_uuid(), 'سلمان الفارسي', 'Salman al-Farisi', 'salman-farisi',
  'من أهل البيت', 'From the People of the House', 'early',
  568, 656,
  'الفارسي الذي ترك مجوسية وعيسوية بحثاً عن الحق حتى أسلم على يد النبي ﷺ.',
  'The Persian who left Zoroastrianism and Christianity in search of truth until he embraced Islam at the hands of the Prophet ﷺ.',
  'وُلد سلمان في فارس وكان مجوسياً ثم تنصَّر بحثاً عن الحق. تنقَّل بين كنائس وأديرة حتى أخبره أحد العلماء بأوصاف النبي الخاتم في الشام. قدم إلى المدينة فاستُعبد ثم أعتقه النبي ﷺ. اقترح خندق الأحزاب مما أنقذ المسلمين. قال النبي ﷺ: "سلمان منا أهل البيت".',
  'Salman was born in Persia as a Zoroastrian, then converted to Christianity in search of truth. He traveled through churches and monasteries until a scholar told him of the signs of the final Prophet. He came to Madinah, was enslaved, then freed by the Prophet ﷺ. He suggested digging the Trench during the Battle of the Confederates, saving the Muslims. The Prophet ﷺ said: "Salman is from us, the People of the House."',
  '["اقتراح الخندق في غزوة الأحزاب", "رحلته الطويلة بحثاً عن الحق", "شهادة النبي بأنه من أهل البيت"]',
  '["Suggesting the Trench at the Battle of Confederates", "His long journey in search of truth", "The Prophet''s testimony that he is from the People of the House"]',
  true
)
 ) AS seed(id, name_ar, name_en, slug, title_ar, title_en, category, birth_year, death_year, summary_ar, summary_en, story_ar, story_en, virtues_ar, virtues_en, published)
ON CONFLICT (slug) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  title_ar = EXCLUDED.title_ar,
  category = EXCLUDED.category,
  death_year = EXCLUDED.death_year,
  bio_ar = EXCLUDED.bio_ar,
  bio_en = EXCLUDED.bio_en,
  metadata = EXCLUDED.metadata,
  published = EXCLUDED.published;
