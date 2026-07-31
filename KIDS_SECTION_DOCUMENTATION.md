# قسم الأطفال - الوثائق الشاملة

## نظرة عامة

قسم متخصص للأطفال يوفر محتوى تعليمي إسلامي آمن وممتع مع دعم كامل للمشاركة الاجتماعية على Facebook و YouTube.

---

## 📁 هيكل الملفات

```
app/
├── kids/
│   ├── page.tsx              # صفحة قسم الأطفال الرئيسية
│   ├── [slug]/
│   │   ├── page.tsx          # صفحة عرض محتوى محدد
│   │   └── layout.tsx        # تخطيط الصفحة الداخلية
│   └── puzzle/
│       ├── page.tsx          # لعبة الترتيب الإسلامية
│       └── layout.tsx        # تخطيط اللعبة

admin/
├── kids/
│   ├── page.tsx              # صفحة إدارة قسم الأطفال
│   └── actions.ts            # إجراءات حفظ المحتوى

components/
├── kids/
│   ├── kids-quiz.tsx         # مكون الاختبارات التفاعلية
│   └── kids-share.tsx        # مكون المشاركة على السوشيال ميديا (جديد)

lib/
├── data/
│   ├── kids-content.ts       # مكتبة المحتوى الثابت
│   └── kids-stories.ts       # قصص الأطفال

supabase/
├── migrations/
│   ├── 20260718020000_admin_kids_permissions_and_content_alignment.sql
│   ├── 20260728010000_kids_content_legacy_alignment.sql
│   └── 20260731000000_kids_social_media_integration.sql (جديد)
```

---

## 📊 أنواع المحتوى المدعومة

| النوع | الوصف | الفئة العمرية |
|--------|----------|-------------|
| story | قصص الأنبياء والقصص الإسلامية | 6-12 |
| prayer | أدعية مأثورة | 3-12 |
| wudu | شرح الوضوء والصلاة | 6-12 |
| quiz | اختبارات تفاعلية | 6-15 |
| game | ألعاب تعليمية | 6-12 |
| puzzle | ألغاز وألعاب ترتيب | 6-12 |
| coloring | صور للتلوين | 3-8 |
| matching | ألعاب التوصيل | 3-8 |
| video | فيديوهات تعليمية (YouTube) | 6-12 |
| memorize | برامج الحفظ والتذكر | 9-15 |

---

## 🎯 الفئات العمرية

```typescript
"3-5"   // 3-5 سنوات (الأطفال الصغار)
"6-8"   // 6-8 سنوات (المرحلة الابتدائية الأولى)
"9-12"  // 9-12 سنة (المرحلة الابتدائية المتقدمة)
"13-15" // 13-15 سنة (المرحلة الإعدادية)
```

---

## 🔗 التكامل مع الأنظمة الخارجية

### YouTube Integration ✅

#### الميزات:
- تضمين فيديوهات YouTube مباشرة
- استخراج thumbnail الفيديو تلقائياً
- دعم القوائم الكاملة

#### الاستخدام:
```typescript
{
  type: "video",
  video_url: "https://www.youtube.com/embed/RGgUMsVMuIE",
  youtube_video_id: "RGgUMsVMuIE",
  featured_image_url: "https://img.youtube.com/vi/RGgUMsVMuIE/hqdefault.jpg"
}
```

#### المتغيرات المطلوبة:
```env
YOUTUBE_API_KEY=          # للوصول إلى بيانات الفيديو
YOUTUBE_CHANNEL_ID=       # معرف القناة
KIDS_YOUTUBE_INTEGRATION_ENABLED=true
```

### Facebook Integration ✅

#### الميزات:
- مشاركة المحتوى على Facebook
- تتبع عدد المشاركات
- رسائل مخصصة للمشاركة

#### الاستخدام:
```typescript
// في مكون KidsShare
<Button onClick={handleFacebookShare}>
  شارك على Facebook
</Button>
```

#### المتغيرات المطلوبة:
```env
FACEBOOK_APP_ID=1547748713614342              # معرف التطبيق
FACEBOOK_APP_SECRET=                          # السر (لا تنشره)
FACEBOOK_PAGE_ACCESS_TOKEN=                   # رمز الصفحة
FACEBOOK_PAGE_ID=993431613855177              # معرف الصفحة
NEXT_PUBLIC_FACEBOOK_APP_ID=1547748713614342  # معرف عام آمن
KIDS_FACEBOOK_SHARE_ENABLED=true              # تفعيل المشاركة
```

---

## 📱 مكون المشاركة الاجتماعية (KidsShare)

### الميزات:
- مشاركة على Facebook ✅
- مشاركة على WhatsApp ✅
- مشاركة على Twitter ✅
- نسخ الرابط ✅
- تتبع الإحصائيات

### الاستخدام:
```typescript
import { KidsShare } from '@/components/kids/kids-share';

<KidsShare
  title="اسم المحتوى"
  description="وصف قصير"
  slug="content-slug"
  type="story"
  imageUrl="https://..."
/>
```

### Props:
```typescript
interface KidsShareProps {
  title: string;           // عنوان المحتوى
  description?: string;    // وصف قصير
  slug: string;           // رابط المحتوى
  type: string;           // نوع المحتوى
  imageUrl?: string;      // صورة مميزة
}
```

---

## 🗄️ قاعدة البيانات (Supabase)

### الجدول: kids_content

```sql
CREATE TABLE kids_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- المحتوى الأساسي
  title_ar text NOT NULL,
  title_en text,
  slug text UNIQUE NOT NULL,
  content_ar text,
  content_en text,
  summary_ar text,
  summary_en text,
  
  -- التصنيف
  type text DEFAULT 'story',
  content_type text,
  age_group text DEFAULT '6-8',
  age_min integer,
  age_max integer,
  
  -- الوسائط
  featured_image_url text,
  video_url text,
  youtube_video_id text,
  
  -- البيانات الديناميكية
  quiz_data jsonb,
  metadata jsonb,
  
  -- الحالة والنشر
  published boolean DEFAULT false,
  is_active boolean DEFAULT true,
  featured boolean DEFAULT false,
  
  -- المشاركة الاجتماعية
  facebook_share_enabled boolean DEFAULT true,
  likes integer DEFAULT 0,
  shares integer DEFAULT 0,
  
  -- الأوقات
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

CREATE INDEX kids_content_public_idx 
  ON kids_content(published, is_active, age_group, type);

CREATE INDEX kids_content_social_stats_idx
  ON kids_content(facebook_share_enabled, published, likes, shares)
  WHERE published = true AND is_active = true;
```

### Row Level Security (RLS)

```sql
-- السماح بالوصول العام للمحتوى المنشور
CREATE POLICY "Allow public read access to published kids content"
  ON kids_content FOR SELECT
  USING (published = true AND is_active = true);

-- السماح لـ service role بتحديث الإحصائيات
CREATE POLICY "Allow service role to update social stats"
  ON kids_content FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
```

---

## 🎮 إدارة المحتوى

### إضافة محتوى جديد:

1. اذهب إلى: `/admin/kids`
2. ملئ النموذج:
   - العنوان بالعربية (مطلوب)
   - الرابط المختصر (مطلوب)
   - النوع (قصة، اختبار، إلخ)
   - الفئة العمرية
   - المحتوى بالعربية
   - صورة مميزة و/أو فيديو YouTube
3. اختياري: أضف بيانات اختبار بصيغة JSON
4. انقر "إضافة المحتوى واللعبة"

### صيغة بيانات الاختبار (JSON):

```json
{
  "questions": [
    {
      "text": "السؤال الأول؟",
      "options": ["الخيار أ", "الخيار ب", "الخيار ج", "الخيار د"],
      "correctAnswer": 0
    },
    {
      "text": "السؤال الثاني؟",
      "options": ["الخيار أ", "الخيار ب", "الخيار ج"],
      "correctAnswer": 1
    }
  ]
}
```

---

## 📊 الإحصائيات والتتبع

### API Route: `/api/kids/track-share`

تتبع مشاركات المحتوى على وسائل التواصل:

```typescript
POST /api/kids/track-share
{
  slug: "story-ibrahim",
  platform: "facebook",  // facebook | whatsapp | twitter | copy-link
  action: "share"        // optional
}
```

### الاستجابة:
```json
{
  "success": true,
  "message": "Share tracked on facebook"
}
```

---

## 🔒 الأمان

### Row Level Security:
✅ المحتوى المنشور فقط يظهر للمستخدمين العام
✅ Admin فقط يمكنه تعديل المحتوى
✅ Service role يمكنه تحديث الإحصائيات

### بيانات آمنة:
✅ لا تخزين بيانات شخصية للأطفال
✅ لا تتبع تفصيلي للأفراد
✅ COPPA compliant (Kids Online Privacy)

---

## 🧪 الاختبار

### اختبار في المتصفح:
```bash
# الرئيسية
http://localhost:3000/kids

# محتوى محدد
http://localhost:3000/kids/story-ibrahim
http://localhost:3000/kids/quiz-pillars

# لعبة الترتيب
http://localhost:3000/kids/puzzle

# إدارة (يتطلب auth admin)
http://localhost:3000/admin/kids
```

### اختبار API:
```bash
curl -X POST http://localhost:3000/api/kids/track-share \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "story-ibrahim",
    "platform": "facebook"
  }'
```

---

## 🚀 التطويرات المستقبلية

- [ ] إضافة نظام النقاط والرموز (Gamification)
- [ ] دعم الشارات (Badges)
- [ ] متابعة التقدم الشخصي
- [ ] تقارير للوالدين
- [ ] التعاون مع محتويين إسلاميين
- [ ] دعم لغات إضافية
- [ ] نسخة تطبيق mobile

---

## 📞 الدعم والمساعدة

للمساعدة في:
- إضافة محتوى جديد: اذهب إلى `/admin/kids`
- الإبلاغ عن مشاكل: استخدم نموذج الاتصال
- الاقتراحات: ارسل بريد إلى الفريق

---

**آخر تحديث**: 31 يوليو 2026
**الإصدار**: 1.0.0 مع دعم Facebook و YouTube
**الحالة**: ✅ جاهز للإنتاج
