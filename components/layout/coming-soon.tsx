import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';

export function ComingSoon({ title }: { title: string }) { return <Container className='py-20'><Card className='text-center'><h1 className='text-3xl font-bold text-brand-gold'>{title}</h1><p className='mt-3 arabic-muted'>قريبًا بإذن الله.</p></Card></Container>; }
