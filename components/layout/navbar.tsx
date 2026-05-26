import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/app/auth/actions';

const links = [{href:'/quran',label:'القرآن'},{href:'/hadith',label:'الأحاديث'},{href:'/stories',label:'القصص'},{href:'/scholars',label:'العلماء'},{href:'/prayer',label:'الصلاة'},{href:'/adhkar',label:'الذكر'}];

export async function Navbar(){
  const token = (await cookies()).get('sb_access_token')?.value;
  return <header className='sticky top-0 z-40 border-b border-brand-gold/20 bg-brand-emeraldDeep/80 backdrop-blur'><Container className='flex min-h-16 flex-wrap items-center justify-between gap-3 py-2'><Link href='/' className='flex items-center gap-3'><Image src='/brand/zikr-logo-1.jpg' alt='ZIKR' width={40} height={40} className='rounded-full border border-brand-gold/30'/><span className='text-lg font-bold text-brand-gold'>ذِكرٌ</span></Link><nav className='flex flex-wrap gap-4'>{links.map(l=><Link key={l.href} href={l.href} className='text-sm text-brand-cream hover:text-brand-gold'>{l.label}</Link>)}</nav><div>{token ? <div className='flex items-center gap-2'><Button variant='ghost' href='/profile'>الملف الشخصي</Button><form action={logoutAction}><Button variant='secondary' type='submit'>خروج</Button></form></div> : <Button href='/auth/login'>تسجيل الدخول</Button>}</div></Container></header>;
}
