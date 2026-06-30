import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { getRadioChannels, getNasheeds } from '@/lib/services/radio';

export const metadata = {
  title: 'إذاعة القرآن الكريم | ZIKR',
  description: 'بث مباشر لإذاعات القرآن الكريم والأناشيد الإسلامية',
};

export default async function RadioPage() {
  const channels = await getRadioChannels();
  const nasheeds = await getNasheeds();

  return (
    <Container className="py-12 space-y-12">
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-brand-gold">📻 إذاعة ذِكر</h1>
          <p className="text-brand-cream/70">بث مباشر على مدار الساعة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {channels.map((channel) => (
            <Card key={channel.id} className="p-6 border-brand-gold/20 bg-black/40 hover:border-brand-gold/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-brand-cream">{channel.name}</h3>
                  <p className="text-sm text-brand-gold/60">{channel.category === 'quran' ? 'إذاعة قرآن كريم' : 'تواشيح'}</p>
                </div>
                <audio controls className="h-10">
                  <source src={channel.streamUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-brand-gold border-r-4 border-brand-gold pr-4">🎵 أناشيد مختارة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nasheeds.map((nasheed) => (
            <Card key={nasheed.id} className="p-4 border-brand-gold/10 bg-black/20">
              <h4 className="font-bold text-brand-cream">{nasheed.title}</h4>
              <p className="text-xs text-brand-gold/50 mb-3">{nasheed.artist}</p>
              <audio controls className="w-full h-8">
                <source src={nasheed.audioUrl} type="audio/mpeg" />
              </audio>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
