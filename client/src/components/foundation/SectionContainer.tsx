import type { PropsWithChildren } from 'react';

export function SectionContainer({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <section className={`mx-auto w-full max-w-7xl px-4 ${className}`}>{children}</section>;
}
