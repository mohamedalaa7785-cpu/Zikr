import type { PropsWithChildren } from 'react';

export function GlassCard({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-3xl border border-amber-100/15 bg-black/35 backdrop-blur-xl ${className}`}>{children}</div>;
}
