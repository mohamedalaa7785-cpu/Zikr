import { cn } from '@/lib/utils';
import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost';
const styles: Record<Variant, string> = {
  primary: 'bg-brand-gold text-brand-emeraldDeep hover:bg-brand-goldSoft',
  secondary: 'bg-brand-emerald text-brand-cream border border-brand-gold/50 hover:bg-brand-emeraldDeep',
  ghost: 'text-brand-gold hover:bg-brand-gold/10'
};
export function Button({ variant='primary', className, href, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: Variant; href?: string;}) {
  const base = cn('inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition', styles[variant], className);
  if (href) return <Link href={href} className={base}>{props.children}</Link>;
  return <button className={base} {...props} />;
}
