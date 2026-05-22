import { motion } from 'framer-motion';
import { Menu, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { GlassCard } from '@/components/foundation/GlassCard';
import { SectionContainer } from '@/components/foundation/SectionContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { heroPillars, previewCards, topNavItems } from '@/features/home/content';
import { seoBaseUrl, usePageSEO } from '@/lib/seoHead';

export default function Home() {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);

  usePageSEO({
    title: 'ZIKR | ذِكرٌ — Cinematic Islamic Platform',
    description: 'Spiritual cinematic foundation prepared for Quran, Hadith, AI, Stories, Community, and PWA.',
    path: '/',
    keywords: ['ZIKR', 'Dhikr', 'Quran platform', 'Islamic AI', 'Islamic stories', 'PWA'],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ZIKR | ذِكرٌ',
      url: `${seoBaseUrl}/`,
      inLanguage: ['en', 'ar'],
      description: 'Calm, cinematic and modern Islamic platform foundation.',
    },
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1b2f52_0%,_#071018_35%,_#020203_100%)] text-white">
      <header className="sticky top-0 z-40 border-b border-amber-100/10 bg-black/40 backdrop-blur-xl">
        <SectionContainer className="flex items-center justify-between py-4">
          <button onClick={() => navigate('/')} className="text-xl font-semibold tracking-wide text-amber-100">ZIKR | ذِكرٌ</button>
          <nav className="hidden gap-6 text-sm text-slate-200 md:flex">{topNavItems.map((item) => <button key={item}>{item}</button>)}</nav>
          <div className="hidden md:block"><Button className="bg-amber-300 text-black hover:bg-amber-200">Early Access</Button></div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="ghost" className="md:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></Button></SheetTrigger>
            <SheetContent side="right" className="border-amber-100/20 bg-[#07090d] text-white">
              <div className="mt-10 flex flex-col gap-4">{topNavItems.map((item) => <button key={item} className="text-left">{item}</button>)}</div>
            </SheetContent>
          </Sheet>
        </SectionContainer>
      </header>

      <SectionContainer className="py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <GlassCard className="p-8 shadow-[0_0_40px_rgba(233,215,160,0.12)] md:p-14">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-4 py-1 text-xs text-emerald-100"><Sparkles className="h-4 w-4" /> Foundation Phase</p>
            <h1 className="text-4xl font-bold leading-tight text-amber-100 md:text-6xl">ZIKR | ذِكرٌ — a calm digital space for remembrance.</h1>
            <p className="mt-5 max-w-3xl text-lg text-slate-300">A premium Islamic experience system prepared for future Quran, Hadith, AI assistant, stories, radio, and community modules.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {heroPillars.map((pillar) => (
                <div key={pillar.label} className="rounded-2xl border border-amber-100/15 bg-slate-900/30 p-4">
                  <pillar.icon className="mb-2 h-5 w-5 text-amber-100" />
                  {pillar.label}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </SectionContainer>

      <SectionContainer className="pb-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {previewCards.map((card) => (
            <Card key={card.title} className="border-amber-100/10 bg-slate-950/50 backdrop-blur-xl">
              <CardHeader><CardTitle className="flex items-center gap-2 text-amber-100"><card.icon className="h-5 w-5 text-emerald-300" /> {card.title}</CardTitle></CardHeader>
              <CardContent className="text-slate-300">{card.description}</CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer className="pb-14">
        <GlassCard className="p-8">
          <h2 className="text-2xl font-semibold text-emerald-100">Community preview</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Input placeholder="Email for launch updates" className="border-amber-100/20 bg-black/30 text-white" />
            <Button className="bg-emerald-300 text-black hover:bg-emerald-200">Notify me</Button>
          </div>
        </GlassCard>
      </SectionContainer>

      <footer className="border-t border-amber-100/10 bg-black/45">
        <SectionContainer className="flex flex-col gap-2 py-7 text-sm text-slate-400 md:flex-row md:justify-between">
          <p>© 2026 ZIKR | ذِكرٌ</p>
          <p>Prepared for Quran · Hadith · Stories · AI · Community · PWA · Mobile</p>
        </SectionContainer>
      </footer>
    </div>
  );
}
