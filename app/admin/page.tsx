import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { requireAdmin } from '@/lib/services/admin';
import { runApiHealthChecks } from '@/lib/services/api-health';
import { supabaseServerAdminRequest } from '@/lib/supabase/server';
import { saveCompetitionAction, saveMemorizationPlanAction, savePinnedMessageAction, saveSiteSettingAction, saveStoryAction } from './actions';

type CountRow = { count: number };

async function countTable(table: string) {
  const rows = await supabaseServerAdminRequest<CountRow[]>(`/rest/v1/${table}?select=count`, { cache: 'no-store' }).catch(() => []);
  return rows.length;
}

function Field(props: { name: string; label: string; type?: string; required?: boolean; placeholder?: string; textarea?: boolean; defaultValue?: string }) {
  return <label className='block space-y-1 text-sm text-brand-cream/80'>
    <span>{props.label}</span>
    {props.textarea ? <textarea name={props.name} required={props.required} defaultValue={props.defaultValue} placeholder={props.placeholder} rows={4} className='w-full rounded-lg bg-black/20 p-2 text-brand-cream' /> : <input name={props.name} type={props.type ?? 'text'} required={props.required} defaultValue={props.defaultValue} placeholder={props.placeholder} className='w-full rounded-lg bg-black/20 p-2 text-brand-cream' />}
  </label>;
}

function Published() {
  return <label className='flex items-center gap-2 text-sm arabic-muted'><input name='published' type='checkbox' defaultChecked /> نشر مباشر</label>;
}

export default async function AdminPage() {
  const admin = await requireAdmin();
  const [checks, storiesCount, competitionsCount] = await Promise.all([
    runApiHealthChecks(),
    countTable('stories'),
    countTable('competitions'),
  ]);

  return <Container className='space-y-8 py-10 text-right'>
    <section className='space-y-3'>
      <p className='text-sm arabic-muted'>مرحبًا {admin.display_name ?? admin.email ?? 'Admin'}</p>
      <h1 className='text-3xl font-bold text-brand-gold'>لوحة تحكم الأدمن الكاملة</h1>
      <p className='max-w-3xl leading-8 arabic-muted'>من هنا تقدر تغيّر صور الموقع واللوجو، تضيف قصص ومسابقات ورسائل مثبتة، تضبط خطط الحفظ، وتراجع حالة كل الـ API المتصلة بالموقع.</p>
    </section>

    <section className='grid gap-4 md:grid-cols-3'>
      <Card><p className='text-sm arabic-muted'>القصص</p><strong className='text-3xl text-brand-gold'>{storiesCount}</strong></Card>
      <Card><p className='text-sm arabic-muted'>المسابقات</p><strong className='text-3xl text-brand-gold'>{competitionsCount}</strong></Card>
      <Card><p className='text-sm arabic-muted'>صلاحيتك</p><strong className='text-3xl text-brand-gold'>Admin</strong></Card>
    </section>

    <Card className='space-y-4'>
      <h2 className='text-2xl text-brand-gold'>مراجعة شاملة للـ API</h2>
      <div className='grid gap-3 md:grid-cols-2'>
        {checks.map((check) => <div key={check.name} className='rounded-xl border border-brand-gold/20 bg-black/15 p-4'>
          <div className='flex items-center justify-between gap-3'>
            <h3 className='font-semibold text-brand-cream'>{check.name}</h3>
            <span className={check.status === 'ok' ? 'text-emerald-300' : check.status === 'warning' ? 'text-amber-300' : 'text-red-300'}>{check.status}</span>
          </div>
          <p className='mt-2 text-sm leading-6 arabic-muted'>{check.message}</p>
        </div>)}
      </div>
    </Card>

    <div className='grid gap-6 lg:grid-cols-2'>
      <Card className='space-y-4'>
        <h2 className='text-xl text-brand-gold'>إعدادات الصور واللوجو واليوتيوب</h2>
        <form action={saveSiteSettingAction} className='space-y-3'>
          <input type='hidden' name='key' value='homepage' />
          <Field name='title' label='عنوان رئيسي' placeholder='ذِكرٌ' />
          <Field name='body' label='وصف الصفحة الرئيسية' textarea />
          <Field name='imageUrl' label='رابط صورة الهيرو/البانر' />
          <Field name='logoUrl' label='رابط صورة اللوجو' />
          <Field name='youtubeChannelUrl' label='رابط قناة اليوتيوب' />
          <Field name='pinnedMessage' label='رسالة مثبتة أعلى الموقع' textarea />
          <Button type='submit'>حفظ إعدادات الموقع</Button>
        </form>
      </Card>

      <Card className='space-y-4'>
        <h2 className='text-xl text-brand-gold'>إضافة قصة</h2>
        <form action={saveStoryAction} className='space-y-3'>
          <Field name='title' label='عنوان القصة' required />
          <Field name='slug' label='الرابط المختصر slug' required />
          <Field name='category' label='التصنيف' defaultValue='faith' />
          <Field name='mood' label='الحالة/الوسم' />
          <Field name='coverImage' label='صورة القصة' />
          <Field name='content' label='محتوى القصة' required textarea />
          <Published />
          <Button type='submit'>نشر/تحديث القصة</Button>
        </form>
      </Card>

      <Card className='space-y-4'>
        <h2 className='text-xl text-brand-gold'>إضافة مسابقة</h2>
        <form action={saveCompetitionAction} className='space-y-3'>
          <Field name='title' label='عنوان المسابقة' required />
          <Field name='description' label='وصف المسابقة' textarea />
          <Field name='rules' label='الشروط وطريقة الاشتراك' textarea />
          <Field name='prize' label='الجائزة' />
          <Field name='imageUrl' label='صورة المسابقة' />
          <Field name='startsAt' label='تاريخ البداية' type='datetime-local' />
          <Field name='endsAt' label='تاريخ النهاية' type='datetime-local' />
          <Published />
          <Button type='submit'>إضافة المسابقة</Button>
        </form>
      </Card>

      <Card className='space-y-4'>
        <h2 className='text-xl text-brand-gold'>رسالة مثبتة</h2>
        <form action={savePinnedMessageAction} className='space-y-3'>
          <Field name='title' label='العنوان' defaultValue='تنبيه مهم' />
          <Field name='body' label='نص الرسالة' required textarea />
          <Field name='ctaLabel' label='نص الزر' />
          <Field name='ctaHref' label='رابط الزر' />
          <Published />
          <Button type='submit'>تثبيت الرسالة</Button>
        </form>
      </Card>

      <Card className='space-y-4 lg:col-span-2'>
        <h2 className='text-xl text-brand-gold'>خطة حفظ يومية/أسبوعية بالتجويد</h2>
        <form action={saveMemorizationPlanAction} className='grid gap-3 md:grid-cols-2'>
          <Field name='title' label='اسم الخطة' required />
          <Field name='cadence' label='التكرار' placeholder='daily / weekly / biweekly' defaultValue='daily' />
          <Field name='targetRef' label='المقرر' placeholder='البقرة 1-5' />
          <Field name='tajweedFocus' label='تركيز التجويد' placeholder='الغنة، المدود، مخارج الحروف' />
          <div className='md:col-span-2'><Field name='prompt' label='سؤال أكمل/تسميع' textarea /></div>
          <Published />
          <div className='md:col-span-2'><Button type='submit'>إضافة خطة الحفظ</Button></div>
        </form>
      </Card>
    </div>
  </Container>;
}
