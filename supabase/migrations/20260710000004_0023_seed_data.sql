-- ============================================================================
-- 0023 SEED DATA
-- Idempotent seed data (safe to run multiple times via ON CONFLICT DO NOTHING)
-- Runs after 0022_master_schema.sql
-- ============================================================================

-- Video categories
INSERT INTO public.video_categories (name_ar, name_en, slug, icon, published) VALUES
('تفسير القرآن', 'Quran Tafsir', 'quran-tafsir', 'book-open', true),
('محاضرات إسلامية', 'Islamic Lectures', 'islamic-lectures', 'mic', true),
('قصص الأنبياء', 'Prophets Stories', 'prophets-stories', 'landmark', true),
('أدعية وأذكار', 'Duas & Adhkar', 'duas-adhkar', 'hand-heart', true)
ON CONFLICT (slug) DO NOTHING;

-- Sample videos
INSERT INTO public.videos (title, slug, description, youtube_id, category_id, duration, views, published) VALUES
('تفسير سورة الفاتحة - الشعراوي', 'tafsir-al-fatihah-shaarawi', 'تفسير خواطر الشعراوي لسورة الفاتحة الكريمة', '8DdBmNP4PNA', (SELECT id FROM public.video_categories WHERE slug='quran-tafsir'), 1800, 1250, true),
('تفسير سورة البقرة - ابن عثيمين', 'tafsir-al-baqarah-uthaymin', 'شرح الشيخ ابن عثيمين لسورة البقرة', 'aJ2fVM8fcGU', (SELECT id FROM public.video_categories WHERE slug='quran-tafsir'), 3600, 890, true),
('تفسير سورة يس - الشعراوي', 'tafsir-ya-sin-shaarawi', 'خواطر الشعراوي في تفسير سورة يس', 'KxW0jQY3F3Q', (SELECT id FROM public.video_categories WHERE slug='quran-tafsir'), 2400, 2100, true),
('قصة موسى عليه السلام كاملة', 'story-of-musa-full', 'القصة الكاملة لنبي الله موسى عليه السلام من الولادة إلى مناجاة الطور', 'HqWQ6kzN4C8', (SELECT id FROM public.video_categories WHERE slug='prophets-stories'), 2700, 3400, true),
('قصة يوسف عليه السلام', 'story-of-yusuf-full', 'أحسن القصص: قصة نبي الله يوسف عليه السلام من الجب إلى الملك', 'WpLqF4S8g2E', (SELECT id FROM public.video_categories WHERE slug='prophets-stories'), 3200, 4100, true),
('أدعية من القرآن الكريم', 'quran-duas-collection', 'مجموعة من أدعية القرآن الكريم المستجابة', '5gG3QkN7dR4', (SELECT id FROM public.video_categories WHERE slug='duas-adhkar'), 600, 1800, true),
('أذكار الصباح والمساء', 'morning-evening-adhkar', 'أذكار الصباح والمساء من السنة النبوية الصحيحة', 'T3Yv4zKMp9g', (SELECT id FROM public.video_categories WHERE slug='duas-adhkar'), 900, 2500, true),
('محاضرة عن التوكل على الله', 'lecture-tawakkul', 'محاضرة عن التوكل على الله وأثره في حياة المسلم', '9nF2xq8dK1E', (SELECT id FROM public.video_categories WHERE slug='islamic-lectures'), 1500, 750, true),
('أهمية الصلاة في حياة المسلم', 'importance-of-prayer', 'محاضرة عن أهمية الصلاة وأثرها في حياة المسلم اليومي', 'v4Dq8zNm7yA', (SELECT id FROM public.video_categories WHERE slug='islamic-lectures'), 1200, 980, true)
ON CONFLICT (slug) DO NOTHING;
