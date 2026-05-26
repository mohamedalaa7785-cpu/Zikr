import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { forgotAction } from '../actions';

export default function Page(){return <Container className='py-16'><Card className='mx-auto max-w-md space-y-4'><h1 className='text-2xl text-brand-gold'>نسيت كلمة المرور</h1><form action={forgotAction} className='space-y-3'><input name='email' type='email' required className='w-full rounded-lg bg-black/20 p-2'/><Button type='submit' className='w-full'>إرسال رابط الاستعادة</Button></form></Card></Container>}
