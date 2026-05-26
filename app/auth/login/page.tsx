import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { loginAction } from '../actions';
import { GoogleOAuthButton } from '../google-oauth-button';

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams;
  return <Container className='py-16'><Card className='mx-auto max-w-md space-y-4 text-right'>
    <h1 className='text-2xl text-brand-gold'>تسجيل الدخول</h1>
    {params.error ? <p className='text-sm text-red-300'>{decodeURIComponent(params.error)}</p> : null}
    <form action={loginAction} className='space-y-3'>
      <input name='email' dir='ltr' type='email' required className='w-full rounded-lg bg-black/20 p-2'/>
      <input name='password' dir='ltr' type='password' required className='w-full rounded-lg bg-black/20 p-2'/>
      <Button type='submit' className='w-full'>دخول</Button>
    </form>
    <div className='my-1 h-px bg-brand-gold/20' />
    <GoogleOAuthButton next={params.next} label='المتابعة باستخدام Google' />
  </Card></Container>;
}
