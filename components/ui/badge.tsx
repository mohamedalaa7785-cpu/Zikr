import { cn } from '@/lib/utils';
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) { return <span className={cn('inline-flex rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs text-brand-goldSoft', className)} {...props} />; }
