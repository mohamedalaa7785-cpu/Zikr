import { cn } from '@/lib/utils';
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-brand-gold/25 bg-brand-emerald/40 p-5 shadow-glow backdrop-blur', className)} {...props} />;
}
