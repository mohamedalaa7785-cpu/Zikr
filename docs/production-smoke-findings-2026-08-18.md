# Production smoke findings — 2026-08-18

تم فتح `https://zikrmediaofficial.vercel.app/prophets/yusuf` وظهر قسم **القصة القرآنية الكاملة ومواضعها** مع نص الآيات وروابط المصدر، وظهر أن صفحة production الحالية ما زالت تعرض فقرة النبذة في hero لأن تعديل الواجهة الأخير لم يدخل deployment بعد. لذلك يلزم نشر commit الواجهة ثم إعادة الاختبار.

تم فتح مقال `https://zikrmediaofficial.vercel.app/articles/dhikr-work-and-responsibility` وظهر المحتوى والمراجع النصية الموجودة في المقال بصورة سليمة. migration فهرسة `source_urls` ستوحّد عرض هذه المراجع في مكوّن الإحالات بعد النشر.


بعد نشر commit `74ce88b` بنجاح، أُعيد فتح صفحة يوسف في production. ظهرت الآن بطاقة **القصة التفصيلية والمصادر** بدل فقرة النبذة في hero، ثم قسم **القصة القرآنية الكاملة ومواضعها** مع نص سورة يوسف من الآية 1 فصاعدًا وروابط المصدر. اكتمل ذلك مع نجاح Vercel وCircleCI #40 وSupabase Preview.
