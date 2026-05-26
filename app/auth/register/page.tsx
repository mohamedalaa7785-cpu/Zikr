import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { registerAction } from '../actions';

export default function Page(){return <Container className='py-16'><Card className='mx-auto max-w-md space-y-4'><h1 className='text-2xl text-brand-gold'>إنشاء حساب</h1><form action={registerAction} className='space-y-3'><input name='email' type='email' required className='w-full rounded-lg bg-black/20 p-2'/><input name='password' type='password' required className='w-full rounded-lg bg-black/20 p-2'/><Button type='submit' className='w-full'>تسجيل</Button></form></Card></Container>}
