import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { pageMetadata } from '@/lib/site';
import { generateFAQSchema } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'الأسئلة الشائعة',
  description: 'إجابات على الأسئلة الشائعة حول منصة ZIKR: الحساب، المفضلة، التلاوات، ومزايا المنصة.',
  path: '/faq',
});

const faqs = [
  {
    q: 'هل استخدام الموقع مجاني؟',
    a: 'نعم، معظم محتوى الموقع مجاني بالكامل بما في ذلك القرآن الكريم والتفسير والأحاديث والأدعية. توجد خطط اشتراك للميزات المتقدمة مثل الأبحاث المعمقة والذكاء الاصطناعي.',
  },
  {
    q: 'كيف أحفظ آخر موضع قراءة؟',
    a: 'بعد تسجيل الدخول، يتم حفظ آخر آية قرأتها تلقائياً. يمكنك العودة لها من صفحة المفضلة أو الملف الشخصي.',
  },
  {
    q: 'هل يمكنني تحميل التلاوات الصوتية؟',
    a: 'حالياً يمكن الاستماع للتلاوات مباشرة من الموقع. ميزة التحميل ستتوفر قريباً بإذن الله.',
  },
  {
    q: 'كيف أضيف محتوى للمفضلة؟',
    a: 'اضغط على أيقونة القلب بجانب أي سورة أو حديث أو قصة أو دعاء، وسيُضاف فوراً لقائمة المفضلة الخاصة بك.',
  },
  {
    q: 'هل الموقع متوافق مع الهواتف؟',
    a: 'نعم، الموقع متجاوب بالكامل ويعمل على جميع الأجهزة من الهواتف إلى الأجهزة اللوحية والحواسيب.',
  },
  {
    q: 'كيف أتواصل مع الإدارة؟',
    a: 'يمكنك التواصل معنا عبر صفحة "تواصل معنا" أو عبر البريد الإلكتروني info@zikr.app',
  },
  {
    q: 'هل توجد ميزة الحفظ؟',
    a: 'نعم، يوجد قسم خاص للحفظ يتيح لك إنشاء خطط حفظ ومتابعة تقدمك في حفظ القرآن الكريم.',
  },
  {
    q: 'كيف يعمل الرفيق الروحاني (الذكاء الاصطناعي)؟',
    a: 'الرفيق الروحاني مساعد ذكي يمكنه الإجابة على أسئلتك الإسلامية، تفسير الآيات، وشرح الأحاديث بناءً على مصادر موثوقة.',
  },
];

export default function FAQPage() {
  const faqJsonLd = generateFAQSchema(faqs.map((f) => ({ question: f.q, answer: f.a })));

  return (
    <Container className='space-y-8 py-10 text-right'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className='space-y-3'>
        <h1 className='text-3xl font-bold text-brand-gold'>الأسئلة الشائعة</h1>
        <p className='max-w-3xl leading-8 arabic-muted'>
          إجابات على أكثر الأسئلة شيوعاً حول استخدام الموقع.
        </p>
      </section>

      <section className='space-y-4'>
        {faqs.map((faq, i) => (
          <Card key={i} className='space-y-2'>
            <h2 className='text-lg text-brand-gold'>{faq.q}</h2>
            <p className='leading-8 arabic-muted'>{faq.a}</p>
          </Card>
        ))}
      </section>
    </Container>
  );
}
