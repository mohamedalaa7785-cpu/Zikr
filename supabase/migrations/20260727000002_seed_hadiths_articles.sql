-- ============================================================================
-- ZIKR MEDIA - SEED: HADITH BOOKS, HADITHS, ARTICLES, KIDS CONTENT
-- Date: 2026-07-27
-- Fully idempotent (ON CONFLICT DO NOTHING / DO UPDATE)
-- ============================================================================

-- ── HADITH BOOKS ─────────────────────────────────────────────────────────────

INSERT INTO public.hadith_books (id, slug, name_ar, name_en, source, author_ar, author_en, hadith_count) VALUES
  ('10000000-0000-0000-0000-000000000001', 'bukhari', 'صحيح البخاري', 'Sahih al-Bukhari', 'bukhari', 'محمد بن إسماعيل البخاري', 'Muhammad ibn Ismail al-Bukhari', 7563),
  ('10000000-0000-0000-0000-000000000002', 'muslim', 'صحيح مسلم', 'Sahih Muslim', 'muslim', 'مسلم بن الحجاج', 'Muslim ibn al-Hajjaj', 5362),
  ('10000000-0000-0000-0000-000000000003', 'tirmidhi', 'سنن الترمذي', 'Jami'' al-Tirmidhi', 'tirmidhi', 'محمد بن عيسى الترمذي', 'Muhammad ibn Isa al-Tirmidhi', 3956),
  ('10000000-0000-0000-0000-000000000004', 'abudawud', 'سنن أبي داود', 'Sunan Abu Dawud', 'abudawud', 'أبو داود السجستاني', 'Abu Dawud al-Sijistani', 5274),
  ('10000000-0000-0000-0000-000000000005', 'nasai', 'سنن النسائي', 'Sunan an-Nasa''i', 'nasai', 'أحمد بن شعيب النسائي', 'Ahmad ibn Shu''ayb al-Nasa''i', 5662),
  ('10000000-0000-0000-0000-000000000006', 'ibnmajah', 'سنن ابن ماجه', 'Sunan Ibn Majah', 'ibnmajah', 'محمد بن يزيد ابن ماجه', 'Muhammad ibn Yazid ibn Majah', 4341),
  ('10000000-0000-0000-0000-000000000007', 'muwatta', 'موطأ الإمام مالك', 'Muwatta Malik', 'muwatta', 'مالك بن أنس', 'Malik ibn Anas', 1594),
  ('10000000-0000-0000-0000-000000000008', 'ahmad', 'مسند أحمد', 'Musnad Ahmad', 'ahmad', 'أحمد بن حنبل', 'Ahmad ibn Hanbal', 27647)
ON CONFLICT (slug) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  hadith_count = EXCLUDED.hadith_count;

-- ── SELECTED HADITHS ─────────────────────────────────────────────────────────

INSERT INTO public.hadiths (book_id, hadith_number, text_ar, text_en, narrator_ar, narrator_en, grade_ar, grade_en, chapter) VALUES
-- Bukhari
('10000000-0000-0000-0000-000000000001', '1',
  'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ',
  'Actions are judged by their intentions, and every person will get the reward according to what he has intended. So whoever emigrated for Allah and His Messenger, his emigration will be for Allah and His Messenger; and whoever emigrated for worldly benefits or for a woman to marry, his emigration will be for what he emigrated for.',
  'عمر بن الخطاب رضي الله عنه', 'Umar ibn al-Khattab (may Allah be pleased with him)',
  'صحيح', 'Sahih', 'بدء الوحي'),
('10000000-0000-0000-0000-000000000001', '8',
  'الْإِيمَانُ بِضْعٌ وَسِتُّونَ شُعْبَةً، وَالْحَيَاءُ شُعْبَةٌ مِنَ الْإِيمَانِ',
  'Faith has sixty some branches, and modesty is a branch of faith.',
  'أبو هريرة رضي الله عنه', 'Abu Hurairah (may Allah be pleased with him)',
  'صحيح', 'Sahih', 'كتاب الإيمان'),
('10000000-0000-0000-0000-000000000001', '13',
  'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
  'None of you truly believes until he loves for his brother what he loves for himself.',
  'أنس بن مالك رضي الله عنه', 'Anas ibn Malik (may Allah be pleased with him)',
  'صحيح', 'Sahih', 'كتاب الإيمان'),
('10000000-0000-0000-0000-000000000001', '52',
  'سَمِعْتُ النُّعْمَانَ بْنَ بَشِيرٍ يَقُولُ سَمِعْتُ رَسُولَ اللَّهِ ﷺ يَقُولُ: الْحَلَالُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ، وَبَيْنَهُمَا مُشَبَّهَاتٌ لَا يَعْلَمُهَا كَثِيرٌ مِنَ النَّاسِ، فَمَنِ اتَّقَى الْمُشَبَّهَاتِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ',
  'The lawful is clear and the unlawful is clear, and between them are matters that are ambiguous which many people do not know. He who guards against the ambiguous safeguards his religion and his honor.',
  'النعمان بن بشير رضي الله عنه', 'Nu''man ibn Bashir (may Allah be pleased with him)',
  'صحيح', 'Sahih', 'كتاب الإيمان'),
('10000000-0000-0000-0000-000000000001', '79',
  'مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ',
  'Whoever Allah wishes good for, He gives him understanding in the religion.',
  'معاوية رضي الله عنه', 'Mu''awiyah (may Allah be pleased with him)',
  'صحيح', 'Sahih', 'كتاب العلم'),
-- Muslim
('10000000-0000-0000-0000-000000000002', '1',
  'يَا عَائِشَةُ إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ، وَيُعْطِي عَلَى الرِّفْقِ مَا لَا يُعْطِي عَلَى الْعُنْفِ وَمَا لَا يُعْطِي عَلَى مَا سِوَاهُ',
  'O Aisha, Allah is Kind and He loves kindness, and confers upon kindness which He does not confer upon severity, and does not confer upon anything else besides it.',
  'عائشة رضي الله عنها', 'Aisha (may Allah be pleased with her)',
  'صحيح', 'Sahih', 'كتاب البر والصلة'),
('10000000-0000-0000-0000-000000000002', '2553',
  'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
  'A Muslim is the one from whose tongue and hands other Muslims are safe.',
  'عبد الله بن عمرو رضي الله عنه', 'Abdullah ibn Amr (may Allah be pleased with him)',
  'صحيح', 'Sahih', 'كتاب الإيمان'),
('10000000-0000-0000-0000-000000000002', '2699',
  'مَنْ دَعَا إِلَى هُدًى كَانَ لَهُ مِنَ الْأَجْرِ مِثْلُ أُجُورِ مَنْ تَبِعَهُ لَا يَنْقُصُ ذَلِكَ مِنْ أُجُورِهِمْ شَيْئًا',
  'Whoever calls to guidance, there is for him a reward similar to the reward of those who follow him, without diminishing their rewards at all.',
  'أبو هريرة رضي الله عنه', 'Abu Hurairah (may Allah be pleased with him)',
  'صحيح', 'Sahih', 'كتاب العلم'),
-- Tirmidhi
('10000000-0000-0000-0000-000000000003', '2516',
  'احْرِصْ عَلَى مَا يَنْفَعُكَ وَاسْتَعِنْ بِاللَّهِ وَلَا تَعْجَزْ، وَإِنْ أَصَابَكَ شَيْءٌ فَلَا تَقُلْ لَوْ أَنِّي فَعَلْتُ كَانَ كَذَا وَكَذَا، وَلَكِنْ قُلْ قَدَّرَ اللَّهُ وَمَا شَاءَ فَعَلَ',
  'Be keen on what benefits you, seek help from Allah, and do not be lazy. If something afflicts you, do not say "If only I had done such-and-such, such-and-such would have happened," but rather say "Allah decreed and what He willed He did."',
  'أبو هريرة رضي الله عنه', 'Abu Hurairah (may Allah be pleased with him)',
  'صحيح', 'Sahih', 'كتاب القدر'),
('10000000-0000-0000-0000-000000000003', '2505',
  'التَّائِبُ مِنَ الذَّنْبِ كَمَنْ لَا ذَنْبَ لَهُ',
  'The one who repents from sin is like the one who has no sin.',
  'عبد الله بن مسعود رضي الله عنه', 'Abdullah ibn Masud (may Allah be pleased with him)',
  'حسن', 'Hasan', 'كتاب التوبة'),
('10000000-0000-0000-0000-000000000003', '2406',
  'أَكْثِرُوا ذِكْرَ هَاذِمِ اللَّذَّاتِ يَعْنِي الْمَوْتَ',
  'Increase your remembrance of the destroyer of pleasures — meaning death.',
  'أبو هريرة رضي الله عنه', 'Abu Hurairah (may Allah be pleased with him)',
  'حسن صحيح', 'Hasan Sahih', 'كتاب الزهد'),
-- Abu Dawud
('10000000-0000-0000-0000-000000000004', '4833',
  'الْمَرْءُ عَلَى دِينِ خَلِيلِهِ فَلْيَنْظُرْ أَحَدُكُمْ مَنْ يُخَالِلُ',
  'A person follows the religion of his close friend, so each of you should look at who he befriends.',
  'أبو هريرة رضي الله عنه', 'Abu Hurairah (may Allah be pleased with him)',
  'حسن', 'Hasan', 'كتاب الأدب'),
('10000000-0000-0000-0000-000000000004', '1049',
  'مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا',
  'Whoever sends one blessing upon me, Allah will send ten blessings upon him.',
  'أنس بن مالك رضي الله عنه', 'Anas ibn Malik (may Allah be pleased with him)',
  'صحيح', 'Sahih', 'كتاب الصلاة'),
-- Muwatta
('10000000-0000-0000-0000-000000000007', '3',
  'تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ',
  'I have left among you two things with which you will never go astray as long as you hold fast to them: the Book of Allah and the Sunnah of His Prophet.',
  'مالك بلاغاً', 'Malik as a mursal hadith',
  'صحيح', 'Sahih', 'كتاب القدر')
ON CONFLICT (book_id, hadith_number) DO NOTHING;

-- ── ARTICLE CATEGORIES ───────────────────────────────────────────────────────

INSERT INTO public.article_categories (id, slug, name_ar, name_en, description_ar, description_en) VALUES
  ('20000000-0000-0000-0000-000000000001', 'aqeedah', 'العقيدة', 'Aqeedah', 'مقالات في أصول العقيدة الإسلامية', 'Articles on Islamic creed and theology'),
  ('20000000-0000-0000-0000-000000000002', 'fiqh', 'الفقه', 'Fiqh', 'مسائل فقهية وأحكام شرعية', 'Jurisprudence and Islamic rulings'),
  ('20000000-0000-0000-0000-000000000003', 'seerah', 'السيرة النبوية', 'Seerah', 'قصص وأحداث من حياة النبي ﷺ', 'Stories from the Prophet''s life'),
  ('20000000-0000-0000-0000-000000000004', 'tazkiyah', 'التزكية والأخلاق', 'Tazkiyah', 'تزكية النفس والأخلاق الإسلامية', 'Spiritual purification and Islamic ethics'),
  ('20000000-0000-0000-0000-000000000005', 'quran-sciences', 'علوم القرآن', 'Quran Sciences', 'مقالات في التفسير والإعجاز القرآني', 'Articles on tafsir and Quranic miracles'),
  ('20000000-0000-0000-0000-000000000006', 'history', 'التاريخ الإسلامي', 'Islamic History', 'أحداث ووقائع تاريخية إسلامية', 'Islamic historical events and periods')
ON CONFLICT (slug) DO NOTHING;

-- ── ARTICLES ─────────────────────────────────────────────────────────────────

INSERT INTO public.articles (category_id, slug, title_ar, title_en, summary_ar, summary_en, content_ar, content_en, published, featured) VALUES
(
  '20000000-0000-0000-0000-000000000001',
  'pillars-of-faith',
  'أركان الإيمان الستة',
  'The Six Pillars of Faith',
  'تعرف على أركان الإيمان الستة التي لا يكتمل إيمان المسلم إلا بها.',
  'Learn about the six pillars of faith without which a Muslim''s faith is incomplete.',
  E'أركان الإيمان الستة هي اعتقادات أساسية يجب أن يؤمن بها كل مسلم.\n\n**أولاً: الإيمان بالله**\nالإيمان بوجود الله ووحدانيته وأسمائه الحسنى وصفاته العلى. وهو أساس الإيمان كله.\n\n**ثانياً: الإيمان بالملائكة**\nالملائكة مخلوقات من نور، خُلقوا لعبادة الله وتنفيذ أوامره. ومنهم جبريل وميكائيل وإسرافيل وعزرائيل.\n\n**ثالثاً: الإيمان بالكتب السماوية**\nالإيمان بجميع الكتب التي أنزلها الله على رسله، كالتوراة والإنجيل والزبور والقرآن الكريم.\n\n**رابعاً: الإيمان بالرسل والأنبياء**\nالإيمان بجميع الأنبياء والمرسلين من آدم إلى محمد ﷺ خاتم الأنبياء.\n\n**خامساً: الإيمان باليوم الآخر**\nالإيمان بالبعث والحشر والحساب والجنة والنار.\n\n**سادساً: الإيمان بالقدر**\nالإيمان بأن كل شيء يجري بعلم الله وإرادته ومشيئته، خيره وشره.',
  E'The six pillars of faith are fundamental beliefs every Muslim must hold.\n\n**First: Belief in Allah**\nBelieving in Allah''s existence, oneness, beautiful names, and sublime attributes. This is the foundation of all faith.\n\n**Second: Belief in Angels**\nAngels are beings created from light, created to worship Allah and carry out His commands. Among them are Jibril, Mika''il, Israfil, and Azra''il.\n\n**Third: Belief in Divine Books**\nBelieving in all books revealed by Allah to His messengers, including the Torah, Gospel, Psalms, and the Quran.\n\n**Fourth: Belief in Prophets and Messengers**\nBelieving in all prophets and messengers from Adam to Muhammad ﷺ, the seal of prophets.\n\n**Fifth: Belief in the Last Day**\nBelieving in resurrection, gathering, judgment, Paradise, and Hell.\n\n**Sixth: Belief in Divine Decree**\nBelieving that everything happens by Allah''s knowledge, will, and power — both good and what seems bad.',
  true, true
),
(
  '20000000-0000-0000-0000-000000000003',
  'hijra-lessons',
  'دروس من الهجرة النبوية',
  'Lessons from the Prophetic Migration',
  'الهجرة النبوية حدث عظيم مليء بالدروس والعبر لكل مسلم.',
  'The Prophetic Migration is a momentous event full of lessons for every Muslim.',
  E'**الهجرة النبوية: من مكة إلى المدينة**\n\nفي عام 622م هاجر النبي ﷺ من مكة المكرمة إلى يثرب (المدينة المنورة) هرباً من اضطهاد قريش، وإعداداً لمرحلة جديدة من الدعوة الإسلامية.\n\n**الدرس الأول: التوكل على الله**\nحين اختبأ النبي ﷺ وأبو بكر في غار ثور وكاد المشركون يصلون إليهم، قال النبي: "لا تحزن إن الله معنا" — هذا توكل حقيقي لا يزعزعه الخوف.\n\n**الدرس الثاني: التخطيط مع التوكل**\nالنبي ﷺ خطَّط للهجرة بدقة: اختار الطريق، واستأجر دليلاً، وأعدَّ الراحلة — يعلمنا أن الإيمان لا يعني إهمال الأسباب.\n\n**الدرس الثالث: التضحية في سبيل الله**\nنام علي بن أبي طالب في فراش النبي ﷺ ليلة الهجرة مضحياً بحياته — دليل على أن الحب الحقيقي يستوجب التضحية.\n\n**الدرس الرابع: بناء المجتمع**\nأول ما فعله النبي في المدينة: بنى المسجد وآخى بين المهاجرين والأنصار — الإسلام يبني المجتمعات على التكافل والأخوة.',
  E'**The Prophetic Migration: From Makkah to Madinah**\n\nIn 622 CE, the Prophet ﷺ migrated from Makkah to Yathrib (Madinah) fleeing Quraysh''s persecution and preparing for a new phase of the Islamic mission.\n\n**Lesson One: Trusting in Allah**\nWhen the Prophet ﷺ and Abu Bakr hid in Cave Thawr and the polytheists nearly found them, the Prophet said: "Do not grieve, indeed Allah is with us" — true trust in Allah that fear cannot shake.\n\n**Lesson Two: Planning Alongside Trust**\nThe Prophet ﷺ planned the migration meticulously: he chose the route, hired a guide, prepared the mount — teaching us that faith does not mean neglecting practical means.\n\n**Lesson Three: Sacrifice for Allah''s Cause**\nAli ibn Abi Talib slept in the Prophet''s bed on the night of migration, risking his life — proof that true love requires sacrifice.\n\n**Lesson Four: Building Society**\nThe first thing the Prophet did in Madinah: built the mosque and forged brotherhood between the Muhajirun and Ansar — Islam builds communities on mutual support and brotherhood.',
  true, true
),
(
  '20000000-0000-0000-0000-000000000004',
  'morning-adhkar',
  'أذكار الصباح وفضلها',
  'Morning Adhkar and Their Virtues',
  'تعرف على أذكار الصباح الثابتة بالسنة النبوية وفضائلها العظيمة.',
  'Learn about the morning adhkar established in the Sunnah and their great virtues.',
  E'**أذكار الصباح: حصنك اليومي**\n\nاستيقظت على صوت الأذان، وبدأت يومك بذكر الله — هذا هو الحصن الحقيقي الذي يحمي المسلم طوال يومه.\n\n**أهم أذكار الصباح:**\n\n1. **أذكار الاستيقاظ**: "الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور"\n\n2. **آية الكرسي**: أعظم آية في القرآن، من قرأها حين يصبح لم يزل في ذمة الله حتى يمسي.\n\n3. **سورتا الفلق والناس**: "قل أعوذ برب الفلق" و"قل أعوذ برب الناس" — حماية من كل شر.\n\n4. **سيد الاستغفار**: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك..."\n\n5. **دعاء العافية**: "اللهم عافني في بدني، اللهم عافني في سمعي وبصري..."\n\n**الفضل العظيم:**\nقال النبي ﷺ: "من قال حين يصبح وحين يمسي: سبحان الله وبحمده مائة مرة، لم يأتِ أحدٌ يوم القيامة بأفضل مما جاء به، إلا أحدٌ قال مثله أو زاد عليه."',
  E'**Morning Adhkar: Your Daily Fortress**\n\nYou wake to the sound of the adhan and begin your day with the remembrance of Allah — this is the true fortress that protects the Muslim throughout the day.\n\n**Key Morning Adhkar:**\n\n1. **Upon waking**: "All praise is for Allah who gave us life after death, and to Him is the resurrection."\n\n2. **Ayat al-Kursi**: The greatest verse in the Quran; whoever recites it in the morning remains under Allah''s protection until evening.\n\n3. **Al-Falaq and Al-Nas**: "Say: I seek refuge in the Lord of daybreak" and "Say: I seek refuge in the Lord of mankind" — protection from all evil.\n\n4. **Sayyid al-Istighfar**: "O Allah, You are my Lord, there is no god but You; You created me and I am Your servant..."\n\n5. **Prayer for wellbeing**: "O Allah, grant me wellbeing in my body; O Allah, grant me wellbeing in my hearing and sight..."\n\n**The Great Virtue:**\nThe Prophet ﷺ said: "Whoever says in the morning and evening ''Subhan Allah wa bihamdihi'' 100 times — no one will come on the Day of Judgment with anything better than what he brought, except one who said the same or more."',
  true, false
),
(
  '20000000-0000-0000-0000-000000000005',
  'ijaz-quran',
  'الإعجاز العلمي في القرآن الكريم',
  'Scientific Miracles in the Holy Quran',
  'اكتشف كيف يتطابق القرآن الكريم مع الاكتشافات العلمية الحديثة.',
  'Discover how the Holy Quran aligns with modern scientific discoveries.',
  E'**القرآن والعلم: توافق مذهل**\n\n**أولاً: خلق الكون من رتق**\nقال تعالى: {أَوَلَمْ يَرَ الَّذِينَ كَفَرُوا أَنَّ السَّمَاوَاتِ وَالْأَرْضَ كَانَتَا رَتْقًا فَفَتَقْنَاهُمَا} — يتطابق هذا مع نظرية الانفجار العظيم التي تقول إن الكون بدأ من نقطة واحدة انفجرت.\n\n**ثانياً: توسع الكون**\nقال تعالى: {وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْدٍ وَإِنَّا لَمُوسِعُونَ} — اكتُشف توسع الكون في القرن العشرين بينما القرآن أخبر به قبل 1400 سنة.\n\n**ثالثاً: أطوار الجنين**\nقال تعالى: {ثُمَّ خَلَقْنَا النُّطْفَةَ عَلَقَةً فَخَلَقْنَا الْعَلَقَةَ مُضْغَةً...} — هذا التسلسل الدقيق لأطوار الجنين لم يُكتشف علمياً إلا في العصر الحديث.\n\n**رابعاً: الجبال أوتاد**\nقال تعالى: {أَلَمْ نَجْعَلِ الْأَرْضَ مِهَادًا وَالْجِبَالَ أَوْتَادًا} — اكتشف العلماء أن للجبال جذوراً عميقة كالأوتاد تثبت القشرة الأرضية.',
  E'**The Quran and Science: Astounding Alignment**\n\n**First: Creation from a Joined Mass**\nAllah says: {Have those who disbelieved not considered that the heavens and the earth were a joined entity, and We separated them?} — this aligns with the Big Bang theory which states the universe began as a single point that exploded.\n\n**Second: Expansion of the Universe**\nAllah says: {And the heaven We constructed with strength, and indeed, We are [its] expander.} — the universe''s expansion was scientifically discovered in the 20th century while the Quran mentioned it 1400 years ago.\n\n**Third: Stages of the Embryo**\nAllah says: {Then We made the sperm-drop into a clinging clot, and We made the clot into a lump...} — this precise sequence of fetal development was only discovered scientifically in the modern era.\n\n**Fourth: Mountains as Pegs**\nAllah says: {Have We not made the earth a resting place and the mountains as pegs?} — scientists discovered that mountains have deep roots like pegs that stabilize the earth''s crust.',
  true, false
),
(
  '20000000-0000-0000-0000-000000000006',
  'battle-badr',
  'غزوة بدر الكبرى',
  'The Great Battle of Badr',
  'أول معركة كبرى في الإسلام، يوم الفرقان الذي نصر الله فيه المسلمين.',
  'The first major battle of Islam — the Day of Distinction when Allah granted victory to the Muslims.',
  E'**غزوة بدر: يوم الفرقان**\n\n**الخلفية:**\nفي رمضان السنة الثانية للهجرة، خرج النبي ﷺ مع 313 مقاتلاً فقط — معظمهم لا يملكون سلاحاً كاملاً — لاعتراض قافلة تجارية قريشية. لكن القافلة نجت وخرجت قريش بجيش من ألف مقاتل.\n\n**الجيشان:**\n- المسلمون: 313 رجلاً، 2 فرس، 70 بعيراً\n- قريش: ~1000 رجل، 100 فرس، 700 بعير\n\n**النصر المعجز:**\nمال الميزان بالنصر للمسلمين. قُتل كبار قريش كأبي جهل وعتبة وشيبة. قال الله: {وَلَقَدْ نَصَرَكُمُ اللَّهُ بِبَدْرٍ وَأَنتُمْ أَذِلَّةٌ فَاتَّقُوا اللَّهَ لَعَلَّكُمْ تَشْكُرُونَ}\n\n**الدروس:**\n- النصر بيد الله لا بكثرة العدد\n- الإعداد الجيد والتوكل على الله معاً\n- الدعاء سلاح المؤمن في أشد الأوقات',
  E'**The Battle of Badr: The Day of Distinction**\n\n**Background:**\nIn Ramadan of the second year of Hijra, the Prophet ﷺ set out with only 313 fighters — most without full arms — to intercept a Qurayshi trade caravan. But the caravan escaped and Quraysh marched out with an army of 1,000.\n\n**The Two Armies:**\n- Muslims: 313 men, 2 horses, 70 camels\n- Quraysh: ~1,000 men, 100 horses, 700 camels\n\n**The Miraculous Victory:**\nThe scale tipped in favor of the Muslims. Leaders of Quraysh like Abu Jahl, Utbah, and Shaybah were killed. Allah says: {And already had Allah given you victory at Badr while you were few, so fear Allah; perhaps you will be grateful.}\n\n**Lessons:**\n- Victory is from Allah, not from numbers\n- Good preparation combined with trust in Allah\n- Supplication is the believer''s weapon in the hardest times',
  true, false
)
ON CONFLICT (slug) DO UPDATE SET
  title_ar = EXCLUDED.title_ar,
  title_en = EXCLUDED.title_en,
  published = EXCLUDED.published;

-- ── KIDS CONTENT ─────────────────────────────────────────────────────────────

INSERT INTO public.kids_content (slug, title_ar, title_en, content_type, summary_ar, summary_en, content_ar, content_en, age_min, age_max, published, featured) VALUES
(
  'story-nooh-and-ark',
  'نوح والسفينة الكبيرة',
  'Noah and the Big Ark',
  'story',
  'قصة نبي الله نوح الذي بنى سفينة عملاقة بأمر الله لينجو من الطوفان.',
  'The story of Prophet Nuh who built a giant ark by Allah''s command to survive the great flood.',
  E'كان هناك نبي كريم اسمه نوح عليه السلام. كان قومه لا يؤمنون بالله، فدعاهم كثيراً وكثيراً.\n\nذات يوم قال الله لنوح: "يا نوح، ابنِ سفينة كبيرة جداً"\n\nفبدأ نوح يبني السفينة. كان الناس يمرون ويضحكون ويقولون: "أين البحر يا نوح؟ أنت في الصحراء!"\n\nلكن نوحاً استمر في البناء لأنه يثق بالله.\n\nعندما أتمَّ السفينة، أرسل الله المطر. مطر كثير جداً! وفاض الماء من الأرض!\n\nركب نوح والمؤمنون في السفينة ومعهم من كل حيوان اثنان. وأبحرت السفينة في الماء.\n\nبعد فترة توقف المطر وانحسر الماء، ونزلوا على جبل كبير.\n\nقال نوح: "الحمد لله الذي نجَّانا!"\n\nوالدرس: عندما نطيع الله ونثق به، يحفظنا في كل الأوقات.',
  E'There was a noble prophet named Nuh (Noah). His people did not believe in Allah, so he called them again and again.\n\nOne day Allah said to Nuh: "O Nuh, build a very big boat!"\n\nSo Nuh began to build the boat. People would walk by and laugh, saying: "Where is the sea, Nuh? You are in the desert!"\n\nBut Nuh kept building because he trusted Allah.\n\nWhen he finished the boat, Allah sent rain. So much rain! And water gushed from the earth!\n\nNuh and the believers boarded the boat, along with two of every animal. The boat sailed on the water.\n\nAfter a while, the rain stopped and the water receded. They came down on a big mountain.\n\nNuh said: "Praise be to Allah who saved us!"\n\nThe lesson: When we obey Allah and trust Him, He protects us always.',
  4, 10, true, true
),
(
  'story-yusuf-brothers',
  'يوسف وإخوته العشرة',
  'Yusuf and His Ten Brothers',
  'story',
  'قصة يوسف الذي حسده إخوته لكن الله حفظه وجعله عزيزاً.',
  'The story of Yusuf whose brothers envied him but Allah protected and honored him.',
  E'كان يوسف فتى جميلاً وذكياً، يحبه أبوه يعقوب كثيراً.\n\nذات ليلة رأى يوسف في منامه أن أحد عشر نجماً والشمس والقمر يسجدون له!\n\nقال لأبيه: "يا أبي، رأيت في منامي أحد عشر كوكباً والشمس والقمر رأيتهم لي ساجدين"\n\nقال أبوه: "لا تقص رؤياك على إخوتك يا بني"\n\nلكن إخوة يوسف كانوا يحسدونه. قالوا: "ألقوه في البئر!"\n\nألقوه في بئر مظلمة. كان يوسف يبكي، لكنه لم ينسَ الله.\n\nجاء تجار ووجدوه وأخذوه إلى مصر وباعوه.\n\nعمل يوسف بجد وأمانة. كان صادقاً دائماً.\n\nبعد سنوات طويلة، أصبح يوسف وزيراً في مصر!\n\nجاء إخوته يطلبون الطعام ولم يعرفوه. ثم أخبرهم بنفسه وقال: "لا تخافوا، أنا أخوكم يوسف. الله عفا عنكم"\n\nالدرس: الصدق والصبر يُوصلان للنجاح دائماً.',
  E'Yusuf was a beautiful and intelligent boy whom his father Yaqub loved very much.\n\nOne night, Yusuf had a dream that eleven stars, the sun, and the moon were bowing to him!\n\nHe told his father: "Father, I saw in my dream eleven stars and the sun and the moon bowing to me!"\n\nHis father said: "Do not tell your brothers about this dream, my son."\n\nBut Yusuf''s brothers were jealous of him. They said: "Throw him in the well!"\n\nThey threw him into a dark well. Yusuf cried, but he never forgot Allah.\n\nSome travelers found him and took him to Egypt where they sold him.\n\nYusuf worked hard and honestly. He was always truthful.\n\nYears later, Yusuf became a minister in Egypt!\n\nHis brothers came looking for food and didn''t recognize him. Then he told them who he was and said: "Do not be afraid — I am your brother Yusuf. Allah has forgiven you."\n\nThe lesson: Honesty and patience always lead to success.',
  5, 12, true, true
),
(
  'game-prayer-times',
  'تعلم أوقات الصلاة',
  'Learn Prayer Times',
  'game',
  'لعبة ممتعة لتعلم أوقات الصلوات الخمس.',
  'A fun game to learn the five daily prayer times.',
  E'**مرحباً بك في لعبة أوقات الصلاة!**\n\nاربط كل صلاة بوقتها الصحيح:\n\n🌅 الفجر - قبل شروق الشمس\n☀️ الظهر - عند منتصف النهار\n🌤️ العصر - بعد الظهر\n🌅 المغرب - عند غروب الشمس\n🌙 العشاء - في الليل\n\nهيا نتعلم الصلاة معاً!',
  E'**Welcome to the Prayer Times Game!**\n\nMatch each prayer to its correct time:\n\n🌅 Fajr - Before sunrise\n☀️ Dhuhr - Around midday\n🌤️ Asr - Afternoon\n🌅 Maghrib - At sunset\n🌙 Isha - At night\n\nLet''s learn to pray together!',
  4, 8, true, true
),
(
  'story-spider-web-cave',
  'العنكبوت والحمامة',
  'The Spider and the Dove',
  'story',
  'قصة كيف حمى الله النبي ﷺ في غار ثور بالعنكبوت والحمامة.',
  'How Allah protected the Prophet ﷺ in Cave Thawr through a spider and a dove.',
  E'في ليلة مظلمة، هرب النبي محمد ﷺ وصاحبه أبو بكر من مكة.\n\nاختبآ في غار ثور على جبل كبير.\n\nجاء أعداء النبي يبحثون عنه. وصلوا إلى باب الغار!\n\nقال أبو بكر وهو يرتجف من الخوف: "يا رسول الله، لو نظر أحدهم تحت قدميه لرآنا!"\n\nقال النبي بهدوء: "لا تحزن يا أبا بكر، إن الله معنا"\n\nوفجأة... نسجت عنكبوتٌ صغيرة خيطاً رفيعاً على باب الغار!\n\nوجاء حمامٌ وبنى عشاً على الباب!\n\nنظر الأعداء وقالوا: "لا يمكن أن يكون أحد هنا، العنكبوت نسجت بيتها والحمامة وضعت بيضها!"\n\nومضوا!\n\nقال أبو بكر مبهوتاً: "سبحان الله!"\n\nالدرس: الله يحمينا بأشياء صغيرة لا نتوقعها أبداً.',
  E'On a dark night, the Prophet Muhammad ﷺ and his companion Abu Bakr fled from Makkah.\n\nThey hid in Cave Thawr on a big mountain.\n\nThe Prophet''s enemies came searching for him. They reached the cave entrance!\n\nAbu Bakr trembled with fear and said: "O Messenger of Allah, if one of them looks beneath his feet he will see us!"\n\nThe Prophet calmly said: "Do not grieve, O Abu Bakr. Indeed Allah is with us."\n\nSuddenly... a tiny spider wove a thin web across the cave entrance!\n\nAnd a dove came and built a nest at the entrance!\n\nThe enemies looked and said: "No one could be in here — the spider has woven its home and the dove has laid her eggs!"\n\nAnd they left!\n\nAbu Bakr said in amazement: "SubhanAllah!"\n\nThe lesson: Allah protects us through small, unexpected things.',
  4, 10, true, false
),
(
  'game-arabic-letters',
  'لعبة الحروف العربية',
  'Arabic Letters Game',
  'game',
  'لعبة ممتعة لتعلم الحروف العربية مع الكلمات الإسلامية.',
  'A fun game to learn Arabic letters with Islamic words.',
  E'**مرحباً! هيا نتعلم الحروف!**\n\n**أ** - أبو بكر\n**ب** - بسم الله\n**ت** - توبة\n**ث** - ثواب\n**ج** - جنة\n**ح** - حمد\n**خ** - خير\n**د** - دعاء\n**ذ** - ذكر\n**ر** - رحمة\n**ز** - زكاة\n**س** - سبحان الله\n**ش** - شكر\n**ص** - صلاة\n**ض** - ضياء\n\nكل حرف يبدأ بكلمة جميلة من الإسلام!',
  E'**Welcome! Let''s learn the letters!**\n\n**A (أ)** - Abu Bakr\n**B (ب)** - Bismillah\n**T (ت)** - Tawbah (repentance)\n**Th (ث)** - Thawab (reward)\n**J (ج)** - Jannah (paradise)\n**H (ح)** - Hamd (praise)\n**Kh (خ)** - Khayr (goodness)\n**D (د)** - Du''a (supplication)\n**Dh (ذ)** - Dhikr (remembrance)\n**R (ر)** - Rahmah (mercy)\n**Z (ز)** - Zakah\n**S (س)** - SubhanAllah\n**Sh (ش)** - Shukr (gratitude)\n**S (ص)** - Salah (prayer)\n**D (ض)** - Diya'' (light)\n\nEvery letter starts with a beautiful word from Islam!',
  3, 7, true, false
),
(
  'story-bilal-ahad',
  'بلال والحجارة الثقيلة',
  'Bilal and the Heavy Rocks',
  'story',
  'قصة بلال رضي الله عنه الذي صبر على العذاب ولم يتخلَّ عن الإيمان.',
  'The story of Bilal who endured torture and never gave up his faith.',
  E'في مكة القديمة، كان هناك رجل شجاع اسمه بلال.\n\nكان بلال عبداً، لكن قلبه كان أقوى من الجبال.\n\nآمن بلال بالله وحده، فغضب سيده كثيراً.\n\nكل يوم في الشمس الحارقة، كان السيد يضع حجارةً ثقيلة جداً على صدر بلال ويقول: "اتركْ دينك!"\n\nلكن بلال كان يقول بصوت عالٍ: "أَحَد! أَحَد!" يعني الله واحد!\n\nالحجارة ثقيلة... لكن إيمان بلال أثقل!\n\nذات يوم مرَّ أبو بكر الصديق فرأى بلالاً. شعر بالحزن الشديد.\n\nاشترى أبو بكر بلالاً من سيده وقال: "أنت حر يا بلال!"\n\nبكى بلال من الفرح!\n\nوبعد سنوات، اختاره النبي ﷺ ليكون أول من يؤذِّن في الإسلام.\n\nصعد بلال على سطح الكعبة يوم فتح مكة وقال بأعلى صوته:\n"الله أكبر! الله أكبر! أشهد أن لا إله إلا الله!"\n\nالدرس: الصبر على الأذى في سبيل الله يُفضي إلى الفرح الكبير.',
  E'In ancient Makkah, there was a brave man named Bilal.\n\nBilal was a slave, but his heart was stronger than mountains.\n\nBilal believed in Allah alone, so his master became very angry.\n\nEvery day under the burning sun, the master would place very heavy rocks on Bilal''s chest and say: "Leave your religion!"\n\nBut Bilal would say loudly: "Ahad! Ahad!" — meaning Allah is One!\n\nThe rocks were heavy... but Bilal''s faith was heavier!\n\nOne day Abu Bakr al-Siddiq walked by and saw Bilal. He felt deeply sad.\n\nAbu Bakr bought Bilal from his master and said: "You are free, Bilal!"\n\nBilal cried with joy!\n\nYears later, the Prophet ﷺ chose him to be the first person to give the adhan in Islam.\n\nBilal climbed atop the Kaabah on the day of Makkah''s conquest and called out in his loudest voice:\n"Allahu Akbar! Allahu Akbar! I bear witness there is no god but Allah!"\n\nThe lesson: Patience in the face of harm for Allah''s sake leads to great joy.',
  5, 12, true, true
)
ON CONFLICT (slug) DO UPDATE SET
  title_ar = EXCLUDED.title_ar,
  title_en = EXCLUDED.title_en,
  published = EXCLUDED.published;
