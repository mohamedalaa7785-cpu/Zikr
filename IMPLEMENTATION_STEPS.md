# خطوات تنفيذ الإصلاح - Supabase Full Fix

## المشكلة الأساسية
```
ERROR: column "title_ar" of relation "articles" does not exist (SQLSTATE 42703)
```

## ✅ ما تم إصلاحه

### 1. **إنشاء Migration جديدة**
- ✅ ملف: `supabase/migrations/20260727003000_articles_bilingual_fix.sql`
- ✅ يضيف جميع الأعمدة الثنائية اللغة الناقصة
- ✅ آمن للإعادة (idempotent)
- ✅ يفعّل RLS مع السياسات المناسبة

### 2. **تحديث نماذج TypeScript**
- ✅ ملف: `lib/types/supabase.ts`
- ✅ أضيفت جميع الأعمدة الجديدة (title_ar, title_en, content_ar, etc.)
- ✅ متطابقة مع schema قاعدة البيانات

### 3. **تحديث البيانات الثابتة**
- ✅ ملف: `lib/data/articles.ts`
- ✅ تحديث 6 مقالات ثابتة مع محتوى كامل بالعربية والإنجليزية
- ✅ واجهة StaticArticle محدثة

### 4. **تحسين Search API**
- ✅ ملف: `app/api/search/route.ts`
- ✅ أضيفت المقالات لنتائج البحث
- ✅ البحث يعمل على title_ar

---

## 🚀 خطوات التنفيذ

### الخطوة 1: التحقق من البناء
```bash
# تأكد من عدم وجود أخطاء TypeScript
npm run build
```

✅ **النتيجة**: يجب أن يكتمل البناء بنجاح

---

### الخطوة 2: نشر Migration إلى Supabase

#### الطريقة الأولى: عبر Supabase CLI
```bash
# تثبيت CLI إن لم يكن موجوداً
npm install -g supabase

# نشر Migration
supabase migration up
```

#### الطريقة الثانية: عبر لوحة Supabase
1. اذهب إلى [supabase.com/dashboard](https://supabase.com/dashboard)
2. افتح مشروعك
3. اذهب إلى SQL Editor
4. انسخ محتوى الملف:
   ```
   supabase/migrations/20260727003000_articles_bilingual_fix.sql
   ```
5. الصق الكود وقم بتنفيذه

---

### الخطوة 3: التحقق من نجاح Migration

#### عبر SQL Query
```sql
-- تحقق من أن الأعمدة موجودة
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'articles' 
  AND column_name LIKE '%ar' 
  OR column_name LIKE '%en';

-- يجب أن تراجع:
-- title_ar, title_en, content_ar, content_en,
-- summary_ar, summary_en, featured
```

#### عبر الموقع
1. افتح https://your-site.com/articles
2. يجب أن ترى المقالات تُحمّل بدون أخطاء
3. اختبر البحث من الصفحة الرئيسية

---

### الخطوة 4: اختبر جميع الأقسام

#### 1. صفحة المقالات
```
https://your-site.com/articles
```
- ✅ يجب أن ترى 6 مقالات ثابتة
- ✅ كل مقالة لها صورة وملخص

#### 2. صفحة مقالة فردية
```
https://your-site.com/articles/importance-of-prayer
```
- ✅ يجب أن ترى المقالة الكاملة
- ✅ يجب أن يزيد عدد المشاهدات

#### 3. البحث
- ✅ ابحث عن "الصلاة" من الصفحة الرئيسية
- ✅ يجب أن تجد المقالة ذات الصلة

#### 4. الأقسام الأخرى
- [ ] /adhkar (الأذكار)
- [ ] /quran (القرآن)
- [ ] /hadith (الحديث)
- [ ] /battles (الغزوات)
- [ ] /companions (الصحابة)
- [ ] /tawasheeh (التواشيح)
- [ ] /kids (محتوى الأطفال)

---

## 📊 ملخص التغييرات

| النطاق | قبل | بعد |
|------|------|-----|
| Articles Table | 1 عمود title | 2 عمود (title_ar, title_en) |
| Articles Table | 1 عمود content | 2 عمود (content_ar, content_en) |
| Articles Table | 1 عمود summary | 2 عمود (summary_ar, summary_en) |
| Articles Table | لا يوجد featured | featured flag إضافي |
| TypeScript Types | عمود واحد | أعمدة ثنائية اللغة |
| Static Articles | بدون ترجمات | مع ترجمات كاملة |
| Search API | بدون مقالات | مع المقالات |

---

## 🔍 التحقق من الصحة

### 1. التحقق من قاعدة البيانات
```sql
-- اختبر البحث عن المقالات
SELECT title_ar, title_en, featured 
FROM articles 
WHERE published = true 
LIMIT 5;
```

### 2. التحقق من الكود
```typescript
// في lib/data/articles.ts
console.log(staticArticles[0].title_ar);
// يجب أن يطبع: "أهمية الصلاة في حياة المسلم"
```

### 3. التحقق من الـ Types
```typescript
// يجب أن يجد TypeScript هذه الأعمدة
import type { Database } from '@/lib/types/supabase';
type Article = Database['public']['Tables']['articles']['Row'];
// يجب أن تحتوي على title_ar, title_en, إلخ
```

---

## 🚨 استكشاف الأخطاء

### مشكلة: "column title_ar does not exist"
**الحل**: تأكد من تنفيذ Migration بشكل صحيح
```sql
-- تحقق من وجود الأعمدة
\d articles  -- في PostgreSQL
-- أو
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'articles';
```

### مشكلة: 404 في المقالات
**الحل**: تأكد من أن البيانات الثابتة موجودة
```typescript
import { staticArticles } from '@/lib/data/articles';
console.log(staticArticles); // يجب أن يطبع 6 مقالات
```

### مشكلة: RLS Policy Error
**الحل**: تأكد من تفعيل RLS على الجدول
```sql
-- تحقق من RLS
SELECT 
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'articles';
-- يجب أن تجد: rowsecurity = true
```

---

## 📝 قائمة التحقق النهائية

- [ ] تم بناء المشروع بنجاح (`npm run build`)
- [ ] تم نشر Migration إلى Supabase
- [ ] تم التحقق من وجود الأعمدة في قاعدة البيانات
- [ ] تم اختبار صفحة المقالات
- [ ] تم اختبار مقالة فردية
- [ ] تم اختبار البحث
- [ ] تم اختبار جميع الأقسام الأخرى
- [ ] لا توجد أخطاء في Console
- [ ] لا توجد تحذيرات TypeScript
- [ ] تم التحقق من RLS Policies

---

## 📞 الدعم

إذا واجهت مشاكل:

1. **تحقق من Logs**
   - browser console (F12)
   - server logs
   - Supabase logs

2. **تحقق من البيانات**
   ```sql
   SELECT * FROM articles LIMIT 1;
   ```

3. **أعد محاولة البناء**
   ```bash
   npm run build
   ```

4. **امسح Cache وأعد البدء**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

**آخر تحديث**: 27 يوليو 2026
**الحالة**: ✅ جاهز للنشر
