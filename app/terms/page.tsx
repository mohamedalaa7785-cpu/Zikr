import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  description: "شروط استخدام منصة ZIKR وحدود المحتوى والخدمات الرقمية المقدمة.",
};

export default function TermsPage() {
  return (
    <Container className="max-w-4xl space-y-8 py-12">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-brand-gold">الشروط والأحكام</h1>
        <p className="arabic-muted">آخر تحديث: 7 يونيو 2026</p>
      </section>

      <Card className="space-y-4 leading-8">
        <h2 className="text-2xl font-semibold text-brand-gold">
          الاستخدام المقبول
        </h2>
        <p className="arabic-muted">
          تُقدم المنصة لأغراض التعلّم والتذكير والانتفاع بالمحتوى الإسلامي. يجب
          عدم إساءة استخدام الخدمات أو محاولة تعطيلها أو نشر محتوى مخالف أو
          مضلل.
        </p>
      </Card>

      <Card className="space-y-4 leading-8">
        <h2 className="text-2xl font-semibold text-brand-gold">
          المحتوى والمصادر
        </h2>
        <p className="arabic-muted">
          نسعى لتقديم محتوى نافع ودقيق، ومع ذلك قد تعتمد بعض الصفحات على تكاملات
          خارجية أو بيانات يتم تحديثها دوريًا. عند وجود مسألة شرعية عملية يُرجع
          إلى أهل العلم الموثوقين.
        </p>
      </Card>

      <Card className="space-y-4 leading-8">
        <h2 className="text-2xl font-semibold text-brand-gold">التغييرات</h2>
        <p className="arabic-muted">
          قد يتم تحديث هذه الشروط عند تطوير المنصة أو إضافة ميزات جديدة. استمرار
          الاستخدام بعد النشر يعني قبول النسخة الأحدث من الشروط.
        </p>
      </Card>
    </Container>
  );
}
