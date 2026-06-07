import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "عن المنصة",
  description: `تعرف على رسالة ${siteConfig.shortName} في تقديم القرآن والحديث والمحتوى الإسلامي بتجربة رقمية ميسرة.`,
};

export default function AboutPage() {
  return (
    <Container className="max-w-4xl space-y-8 py-12">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-brand-gold">عن ZIKR | ذِكرٌ</h1>
        <p className="mx-auto max-w-2xl text-lg leading-8 arabic-muted">
          منصة روحانية رقمية تجمع القرآن الكريم والحديث الشريف والقصص والمحتوى
          المعرفي الإسلامي في تجربة عربية حديثة وسهلة الوصول.
        </p>
      </section>

      <Card className="space-y-4 leading-8">
        <h2 className="text-2xl font-semibold text-brand-gold">رسالتنا</h2>
        <p className="arabic-muted">
          نهدف إلى تقريب المحتوى الإسلامي الموثوق للمستخدمين عبر واجهة منظمة،
          ودعم رحلة التلاوة والتدبر والحفظ والمتابعة اليومية دون تعقيد.
        </p>
      </Card>

      <Card className="space-y-4 leading-8">
        <h2 className="text-2xl font-semibold text-brand-gold">
          ما الذي تقدمه المنصة؟
        </h2>
        <ul className="list-inside list-disc space-y-2 arabic-muted">
          <li>تصفح القرآن الكريم والسور والآيات مع تجربة قراءة مريحة.</li>
          <li>أقسام للحديث والقصص والأذكار ومواقيت الصلاة.</li>
          <li>محتوى تعليمي وروحاني يساعد الأسرة والناشئة.</li>
          <li>أدوات بحث ومفضلة وحفظ قابلة للتوسع.</li>
        </ul>
      </Card>
    </Container>
  );
}
