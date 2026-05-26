import { Container } from '@/components/ui/container';

export function Footer() {
  return (
    <footer className='mt-20 border-t border-brand-gold/20 py-8'>
      <Container className='text-center text-sm arabic-muted'>
        © {new Date().getFullYear()} ZIKR | ذِكرٌ — منصة روحانية حديثة.
      </Container>
    </footer>
  );
}
