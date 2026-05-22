import { usePageSEO, seoBaseUrl } from "@/lib/seoHead";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function LocalizedHome({ lang }: { lang: "en" | "ar" }) {
  const [, navigate] = useLocation();
  const isAr = lang === "ar";

  usePageSEO({
    title: isAr ? "ZIKR | ذِكرٌ العربية | تحليل تاريخي" : "ZIKR | ذِكرٌ EN | Editorial History",
    description: isAr
      ? "نسخة عربية تحريرية مستقلة تركز على تحليل التاريخ العميق وبنية القوة."
      : "English editorial edition focused on long-form historical power analysis.",
    path: `/${lang}`,
    language: lang,
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: isAr ? "ZIKR | ذِكرٌ Arabic" : "ZIKR | ذِكرٌ English",
      url: `${seoBaseUrl}/${lang}`,
      inLanguage: isAr ? "ar-EG" : "en-US",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-5xl space-y-5">
        <h1 className="text-4xl font-bold text-amber-300">{isAr ? "الروايات الخفية — النسخة العربية" : "ZIKR | ذِكرٌ — English Edition"}</h1>
        <p className="text-lg text-slate-300">
          {isAr
            ? "هذه النسخة العربية تقدم قراءة سياقية للتاريخ السياسي والاجتماعي، مع تركيز على المؤسسات والسرديات المؤثرة في الوعي العام."
            : "This English edition emphasizes institution-level historical analysis, editorial context, and long-horizon interpretation."}
        </p>
        <p className="text-lg text-slate-300">
          {isAr
            ? "المحتوى العربي مختلف في الزوايا والأمثلة المختارة، وليس ترجمة حرفية للنسخة الإنجليزية."
            : "The English stream is curated with different angles and references instead of literal translation from Arabic."}
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/episodes")} className="bg-amber-600 text-black hover:bg-amber-700">{isAr ? "استكشف الحلقات" : "Explore Episodes"}</Button>
          <Button variant="outline" onClick={() => navigate("/")}>{isAr ? "الصفحة الرئيسية" : "Main Homepage"}</Button>
        </div>
      </div>
    </main>
  );
}
