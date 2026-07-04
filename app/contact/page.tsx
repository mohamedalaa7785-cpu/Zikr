import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <Container className='space-y-8 py-10 text-right'>
      <section className='space-y-3'>
        <h1 className='text-3xl font-bold text-brand-gold'>تواصل معنا</h1>
        <p className='max-w-3xl leading-8 arabic-muted'>
          نسعد بتلقي استفساراتك واقتراحاتك. تواصل معنا عبر القنوات التالية.
        </p>
      </section>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card className='space-y-4'>
          <h2 className='text-xl text-brand-gold'>معلومات التواصل</h2>
          <div className='space-y-3 text-sm'>
            <div className='flex items-center gap-3'>
              <span className='text-xl'>📧</span>
              <div>
                <p className='arabic-muted'>البريد الإلكتروني</p>
                <p className='text-brand-gold'>info@zikr.app</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-xl'>📱</span>
              <div>
                <p className='arabic-muted'>تطبيق تيليجرام</p>
                <p className='text-brand-gold'>@zikr_app</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-xl'>🌐</span>
              <div>
                <p className='arabic-muted'>الموقع الإلكتروني</p>
                <p className='text-brand-gold'>zikr.app</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className='space-y-4'>
          <h2 className='text-xl text-brand-gold'>أرسل رسالة</h2>
          <form className='space-y-3'>
            <div>
              <label className='text-sm arabic-muted'>الاسم</label>
              <input
                type='text'
                className='mt-1 w-full rounded-lg border border-brand-gold/20 bg-brand-emerald/30 px-4 py-2 text-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none'
                placeholder='اسمك الكريم'
              />
            </div>
            <div>
              <label className='text-sm arabic-muted'>البريد الإلكتروني</label>
              <input
                type='email'
                className='mt-1 w-full rounded-lg border border-brand-gold/20 bg-brand-emerald/30 px-4 py-2 text-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none'
                placeholder='email@example.com'
              />
            </div>
            <div>
              <label className='text-sm arabic-muted'>الرسالة</label>
              <textarea
                rows={4}
                className='mt-1 w-full rounded-lg border border-brand-gold/20 bg-brand-emerald/30 px-4 py-2 text-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none'
                placeholder='اكتب رسالتك هنا...'
              />
            </div>
            <Button type='button' className='w-full'>إرسال</Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
