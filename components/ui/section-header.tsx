export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="mb-6 space-y-2 text-right"><h2 className="text-2xl font-bold text-brand-cream md:text-3xl">{title}</h2>{subtitle && <p className="arabic-muted">{subtitle}</p>}</div>;
}
