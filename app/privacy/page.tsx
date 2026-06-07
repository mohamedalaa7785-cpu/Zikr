import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description:
    "سياسة خصوصية منصة ZIKR وبيان التعامل مع البيانات والحسابات والتكاملات الخارجية.",
};

export default function PrivacyPage() {
  return (
    <Container className="max-w-4xl space-y-8 py-12">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-brand-gold">سياسة الخصوصية</h1>
        <p className="arabic-muted">آخر تحديث: 7 يونيو 2026</p>
      </section>

      <Card className="space-y-4 leading-8">
        <h2 className="text-2xl font-semibold text-brand-gold">
          البيانات التي قد نعالجها
        </h2>
        <p className="arabic-muted">
          قد تستخدم المنصة بيانات الحساب الأساسية مثل البريد الإلكتروني ومعرّف
          المستخدم لتفعيل تسجيل الدخول والمفضلة وميزات المتابعة. لا ينبغي إدخال
          بيانات حساسة في حقول عامة أو في البحث.
        </p>
      </Card>

      <Card className="space-y-4 leading-8">
        <h2 className="text-2xl font-semibold text-brand-gold">
          ملفات تعريف الارتباط والجلسات
        </h2>
        <p className="arabic-muted">
          تستخدم المنصة ملفات ارتباط ضرورية لإدارة جلسات الدخول وحماية الصفحات
          الخاصة. قد تعتمد بعض الميزات على خدمات خارجية مثل Supabase أو YouTube
          أو خدمات ذكاء اصطناعي عند تفعيلها.
        </p>
      </Card>

      <Card className="space-y-4 leading-8">
        <h2 className="text-2xl font-semibold text-brand-gold">
          حقوق المستخدم
        </h2>
        <p className="arabic-muted">
          يمكنك تسجيل الخروج في أي وقت. عند الحاجة إلى حذف بيانات الحساب أو
          مراجعتها يجب التواصل مع فريق تشغيل المنصة وفق قنوات الدعم المعتمدة عند
          النشر.
        </p>
      </Card>
    </Container>
  );
}
