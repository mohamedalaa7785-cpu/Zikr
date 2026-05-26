import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';

export default async function ProfilePage(){
  const token=(await cookies()).get('sb_access_token')?.value;
  if(!token) redirect('/auth/login');
  return <Container className='py-16 space-y-6'><Card><h1 className='text-2xl text-brand-gold'>الملف الشخصي</h1><p className='arabic-muted mt-2'>يمكنك تعديل الاسم قريبًا بعد ربط قاعدة البيانات مباشرة.</p></Card><Card><h2 className='text-xl text-brand-gold'>المفضلة</h2><p className='arabic-muted'>لا توجد عناصر بعد.</p></Card><Card><h2 className='text-xl text-brand-gold'>التقدم في القراءة</h2><p className='arabic-muted'>لا يوجد تقدم محفوظ بعد.</p></Card></Container>;
}
