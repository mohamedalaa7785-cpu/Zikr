import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { SpiritualSearch } from './spiritual-search';

export const metadata = {
  title: 'البحث الروحاني بالذكاء الاصطناعي',
  description: 'اكتب ما تشعر به واحصل على آيات قرآنية وأحاديث وأذكار تناسب حالتك النفسية',
};

export default function SpiritualAIPage() {
  return (
    <Container className="space-y-12 py-10 text-right">
      {/* Hero Section */}
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-brand-gold">الرفيق الروحاني</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          منصة ذكية تفهم مشاعرك وتقدم لك الراحة من القرآن والسنة والأذكار.
          اكتب ما يدور في قلبك، ودعنا نساعدك في إيجاد السكينة.
        </p>
      </section>

      {/* Main Search Component */}
      <SpiritualSearch />

      {/* Info Cards */}
      <section className="space-y-6">
        <SectionHeader 
          title="كيف يعمل؟" 
          subtitle="خطوات بسيطة للوصول إلى الراحة النفسية"
        />
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="space-y-3 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-brand-gold/20 flex items-center justify-center text-2xl text-brand-gold">
              1
            </div>
            <h3 className="text-lg font-semibold text-brand-cream">عبّر عن مشاعرك</h3>
            <p className="text-sm leading-6 arabic-muted">
              اكتب ما تشعر به بكلماتك الخاصة، أو اختر من الاقتراحات السريعة.
            </p>
          </Card>
          
          <Card className="space-y-3 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-brand-gold/20 flex items-center justify-center text-2xl text-brand-gold">
              2
            </div>
            <h3 className="text-lg font-semibold text-brand-cream">تحليل ذكي</h3>
            <p className="text-sm leading-6 arabic-muted">
              يحلل الذكاء الاصطناعي مشاعرك ويحدد ما تحتاجه من دعم روحاني.
            </p>
          </Card>
          
          <Card className="space-y-3 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-brand-gold/20 flex items-center justify-center text-2xl text-brand-gold">
              3
            </div>
            <h3 className="text-lg font-semibold text-brand-cream">راحة من المصادر الأصيلة</h3>
            <p className="text-sm leading-6 arabic-muted">
              تحصل على آيات قرآنية وأحاديث وأذكار مختارة خصيصاً لحالتك.
            </p>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-6">
        <SectionHeader 
          title="فوائد الرفيق الروحاني" 
          subtitle="لماذا تستخدم هذه الميزة؟"
        />
        
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="space-y-2">
            <h3 className="text-lg text-brand-gold">دعم فوري</h3>
            <p className="text-sm leading-7 arabic-muted">
              احصل على الدعم الروحاني في أي وقت تحتاجه، دون انتظار.
            </p>
          </Card>
          
          <Card className="space-y-2">
            <h3 className="text-lg text-brand-gold">محتوى موثوق</h3>
            <p className="text-sm leading-7 arabic-muted">
              جميع الآيات والأحاديث والأذكار من مصادر إسلامية موثوقة.
            </p>
          </Card>
          
          <Card className="space-y-2">
            <h3 className="text-lg text-brand-gold">خصوصية تامة</h3>
            <p className="text-sm leading-7 arabic-muted">
              مشاعرك وكلماتك تبقى خاصة ولا يتم حفظها أو مشاركتها.
            </p>
          </Card>
          
          <Card className="space-y-2">
            <h3 className="text-lg text-brand-gold">تجربة شخصية</h3>
            <p className="text-sm leading-7 arabic-muted">
              كل استجابة مخصصة لحالتك النفسية الحالية.
            </p>
          </Card>
        </div>
      </section>

      {/* Disclaimer */}
      <Card className="border-amber-300/30 bg-amber-500/5 text-center">
        <p className="text-sm leading-7 text-amber-200">
          ملاحظة: هذه الميزة للدعم الروحاني فقط ولا تغني عن استشارة المتخصصين في حالات الأزمات النفسية.
          إذا كنت تمر بوقت صعب، لا تتردد في طلب المساعدة من أهل الاختصاص.
        </p>
      </Card>
    </Container>
  );
}
