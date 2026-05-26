import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { logoutAction, updateProfileAction } from '@/app/auth/actions';
import { supabaseServerAnonRequest } from '@/lib/supabase/server';

export default async function ProfilePage(){
  const token=(await cookies()).get('sb_access_token')?.value;
  if(!token) redirect('/auth/login');

  const user = await supabaseServerAnonRequest<{ id: string; email?: string }>('/auth/v1/user', {
    headers: { Authorization: `Bearer ${token}` },
  });

  const profiles = await supabaseServerAnonRequest<Array<{ display_name: string | null; avatar_url: string | null }>>(
    `/rest/v1/profiles?select=display_name,avatar_url&id=eq.${user.id}&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const profile = profiles[0];

  return <Container className='py-16 space-y-6'>
    <Card className='space-y-4'>
      <h1 className='text-2xl text-brand-gold'>الملف الشخصي</h1>
      <p className='arabic-muted'>البريد: {user.email ?? 'غير متاح'}</p>
      <div className='flex items-center gap-4'>
        <div className='h-16 w-16 rounded-full bg-black/20 ring-1 ring-brand-gold/30' aria-label='avatar placeholder' />
        <p className='arabic-muted'>{profile?.avatar_url ? 'تم إعداد صورة شخصية.' : 'صورة شخصية تجريبية (Placeholder).'}</p>
      </div>
      <form action={updateProfileAction} className='space-y-3 max-w-md'>
        <label className='block text-sm arabic-muted'>الاسم المعروض</label>
        <input name='displayName' defaultValue={profile?.display_name ?? ''} className='w-full rounded-lg bg-black/20 p-2' />
        <Button type='submit'>حفظ التغييرات</Button>
      </form>
      <form action={logoutAction}><Button type='submit' variant='ghost'>تسجيل الخروج</Button></form>
    </Card>
    <Card><h2 className='text-xl text-brand-gold'>المفضلة</h2><p className='arabic-muted'>Placeholder: ستظهر العناصر المحفوظة قريبًا.</p></Card>
    <Card><h2 className='text-xl text-brand-gold'>التقدم في القراءة</h2><p className='arabic-muted'>Placeholder: لا يوجد تقدم محفوظ بعد.</p></Card>
  </Container>;
}
