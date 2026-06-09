# دليل تفعيل تسجيل الدخول بجوجل (Google OAuth) لمشروع ذِكر

تم تحديث كود المشروع وضبط الإعدادات الأساسية لدعم تسجيل الدخول بجوجل في الموقع والتطبيق (PWA). لضمان عمل النظام بشكل كامل، يرجى اتباع الخطوات النهائية التالية في لوحة تحكم Supabase.

## 1. تفعيل Google Provider في Supabase
بسبب القيود الأمنية، يجب تفعيل المزود يدوياً من لوحة التحكم:
1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard).
2. اختر مشروعك **Zikr**.
3. من القائمة الجانبية، اختر **Authentication** ثم **Providers**.
4. ابحث عن **Google** وقم بتفعيله (Enable).
5. أدخل البيانات التالية التي قمت بتزويدي بها:
   - **Client ID**: `[YOUR_GOOGLE_CLIENT_ID]`
   - **Client Secret**: `[YOUR_GOOGLE_CLIENT_SECRET]`
6. اضغط **Save**.

## 2. ضبط روابط إعادة التوجيه (Redirect URIs)
في نفس صفحة **Authentication**، اذهب إلى تبويب **URL Configuration**:
1. تأكد أن **Site URL** هو: `https://zikrmediaofficial.vercel.app`
2. في قائمة **Redirect URIs**، أضف الرابط التالي:
   - `https://zikrmediaofficial.vercel.app/auth/callback`

## 3. تحديث إعدادات Vercel
تأكد من إضافة المتغيرات التالية في إعدادات المشروع على Vercel (Environment Variables):
- `GOOGLE_CLIENT_ID`: `[YOUR_GOOGLE_CLIENT_ID]`
- `NEXT_PUBLIC_SITE_URL`: `https://zikrmediaofficial.vercel.app`
- `AUTH_CALLBACK_URL`: `https://zikrmediaofficial.vercel.app/auth/callback`

## ما تم إنجازه في الكود:
- **تحديث `google-oauth-button.tsx`**: لضمان استخدام الرابط الصحيح لإعادة التوجيه ديناميكياً.
- **تأمين الجلسة (Session Security)**: تحديث `actions.ts` لضمان استخدام ملفات تعريف ارتباط (Cookies) آمنة وتدعم الـ PWA بشكل أفضل.
- **رفع التعديلات**: تم دفع كافة التغييرات إلى مستودع GitHub الخاص بك.

بمجرد إتمام الخطوات في لوحة تحكم Supabase، سيعمل زر "المتابعة باستخدام Google" في صفحة تسجيل الدخول وإنشاء الحساب بشكل تلقائي.
