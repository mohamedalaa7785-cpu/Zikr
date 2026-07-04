'use client';

import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <Container className="py-12 space-y-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-gold">الشروط والأحكام</h1>
      
      <Card className="space-y-6 p-8">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-brand-gold">1. قبول الشروط</h2>
          <p className="leading-8 arabic-muted">
            باستخدام هذا الموقع، أنت توافق على قبول جميع الشروط والأحكام الواردة هنا.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-brand-gold">2. استخدام الموقع</h2>
          <p className="leading-8 arabic-muted">
            يجب استخدام الموقع بطريقة قانونية وليس بما يخل بحقوق الآخرين أو يقيد استخدامهم للموقع.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-brand-gold">3. محتوى المستخدم</h2>
          <p className="leading-8 arabic-muted">
            أنت تتحمل المسؤولية الكاملة عن أي محتوى تنشره على الموقع ويجب أن يكون متوافقاً مع الشريعة الإسلامية.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-brand-gold">4. المحتوى الإسلامي</h2>
          <p className="leading-8 arabic-muted">
            جميع المحتوى الإسلامي على الموقع تم اختياره بعناية من مصادر موثوقة ومعتمدة.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-brand-gold">5. التعديلات</h2>
          <p className="leading-8 arabic-muted">
            نحتفظ بالحق في تعديل الشروط والأحكام في أي وقت دون إخطار مسبق.
          </p>
        </section>
      </Card>
    </Container>
  );
}
