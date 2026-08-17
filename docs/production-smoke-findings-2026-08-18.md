# Production smoke findings — 2026-08-18

تم فتح `https://zikrmediaofficial.vercel.app/prophets/yusuf` وظهر قسم **القصة القرآنية الكاملة ومواضعها** مع نص الآيات وروابط المصدر، وظهر أن صفحة production الحالية ما زالت تعرض فقرة النبذة في hero لأن تعديل الواجهة الأخير لم يدخل deployment بعد. لذلك يلزم نشر commit الواجهة ثم إعادة الاختبار.

تم فتح مقال `https://zikrmediaofficial.vercel.app/articles/dhikr-work-and-responsibility` وظهر المحتوى والمراجع النصية الموجودة في المقال بصورة سليمة. migration فهرسة `source_urls` ستوحّد عرض هذه المراجع في مكوّن الإحالات بعد النشر.
