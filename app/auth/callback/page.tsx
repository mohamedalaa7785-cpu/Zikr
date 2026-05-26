import { Suspense } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import CallbackClient from './callback-client';

export default function CallbackPage() {
  return (
    <Suspense fallback={<Container className='py-16'><Card className='mx-auto max-w-md text-center'>جارٍ توثيق الحساب...</Card></Container>}>
      <CallbackClient />
    </Suspense>
  );
}
