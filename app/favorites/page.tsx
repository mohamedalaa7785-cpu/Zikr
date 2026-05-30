import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { supabaseServerAnonRequest } from '@/lib/supabase/server';

type Favorite = {
  id: string;
  item_type: string;
  item_ref: string;
  created_at: string;
};

export default async function FavoritesPage() {
  const token = (await cookies()).get('sb_access_token')?.value;
  
  if (!token) {
    return (
      <Container className="py-16">
        <Card className="text-center space-y-4 py-8">
          <h1 className="text-3xl font-bold text-brand-gold">المفضلة</h1>
          <p className="arabic-muted max-w-md mx-auto leading-7">
            سجّل الدخول لحفظ الآيات والأحاديث والقصص المفضلة لديك والوصول إليها في أي وقت.
          </p>
          <div className="flex justify-center gap-3">
            <Button href="/auth/login">تسجيل الدخول</Button>
            <Button href="/auth/register" variant="secondary">إنشاء حساب</Button>
          </div>
        </Card>
      </Container>
    );
  }

  let favorites: Favorite[] = [];
  try {
    const user = await supabaseServerAnonRequest<{ id: string }>('/auth/v1/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    favorites = await supabaseServerAnonRequest<Favorite[]>(
      `/rest/v1/favorites?select=*&user_id=eq.${user.id}&order=created_at.desc`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch {
    // Handle error silently
  }

  const quranFavorites = favorites.filter(f => f.item_type === 'quran');
  const hadithFavorites = favorites.filter(f => f.item_type === 'hadith');
  const storyFavorites = favorites.filter(f => f.item_type === 'story');
  const otherFavorites = favorites.filter(f => !['quran', 'hadith', 'story'].includes(f.item_type));

  const typeLabels: Record<string, string> = {
    quran: 'القرآن الكريم',
    hadith: 'الحديث الشريف',
    story: 'القصص',
    scholar: 'العلماء',
    dua: 'الأدعية',
  };

  const formatRef = (type: string, ref: string) => {
    if (type === 'quran') {
      const [surah, ayah] = ref.replace('quran:', '').split(':');
      return `سورة ${surah} - آية ${ayah}`;
    }
    return ref;
  };

  const getLink = (type: string, ref: string) => {
    if (type === 'quran') {
      const [surah, ayah] = ref.replace('quran:', '').split(':');
      return `/quran/${surah}/${ayah}`;
    }
    if (type === 'hadith') {
      return `/hadith`;
    }
    if (type === 'story') {
      return `/stories/${ref.replace('story:', '')}`;
    }
    return '#';
  };

  return (
    <Container className="py-12 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">المفضلة</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          جميع العناصر التي قمت بحفظها من القرآن والأحاديث والقصص
        </p>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {favorites.length} عنصر محفوظ
        </Badge>
      </section>

      {favorites.length === 0 ? (
        <Card className="text-center py-12 space-y-4">
          <div className="text-6xl">📚</div>
          <h2 className="text-2xl text-brand-gold">لا توجد عناصر محفوظة</h2>
          <p className="arabic-muted max-w-md mx-auto leading-7">
            ابدأ بتصفح القرآن والأحاديث والقصص واضغط على أيقونة الحفظ لإضافتها إلى المفضلة.
          </p>
          <div className="flex justify-center gap-3">
            <Button href="/quran">تصفح القرآن</Button>
            <Button href="/hadith" variant="secondary">تصفح الأحاديث</Button>
            <Button href="/stories" variant="ghost">تصفح القصص</Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Quran Favorites */}
          {quranFavorites.length > 0 && (
            <section className="space-y-4">
              <SectionHeader 
                title="آيات قرآنية محفوظة" 
                subtitle={`${quranFavorites.length} آية`}
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {quranFavorites.map((fav) => (
                  <Link href={getLink(fav.item_type, fav.item_ref)} key={fav.id}>
                    <Card className="hover:border-brand-gold/50 transition-colors">
                      <Badge variant="secondary">القرآن</Badge>
                      <p className="mt-2 text-brand-cream">{formatRef(fav.item_type, fav.item_ref)}</p>
                      <p className="text-xs arabic-muted mt-2">
                        {new Date(fav.created_at).toLocaleDateString('ar-EG')}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Hadith Favorites */}
          {hadithFavorites.length > 0 && (
            <section className="space-y-4">
              <SectionHeader 
                title="أحاديث محفوظة" 
                subtitle={`${hadithFavorites.length} حديث`}
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {hadithFavorites.map((fav) => (
                  <Link href={getLink(fav.item_type, fav.item_ref)} key={fav.id}>
                    <Card className="hover:border-brand-gold/50 transition-colors">
                      <Badge variant="secondary">الحديث</Badge>
                      <p className="mt-2 text-brand-cream">{fav.item_ref}</p>
                      <p className="text-xs arabic-muted mt-2">
                        {new Date(fav.created_at).toLocaleDateString('ar-EG')}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Story Favorites */}
          {storyFavorites.length > 0 && (
            <section className="space-y-4">
              <SectionHeader 
                title="قصص محفوظة" 
                subtitle={`${storyFavorites.length} قصة`}
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {storyFavorites.map((fav) => (
                  <Link href={getLink(fav.item_type, fav.item_ref)} key={fav.id}>
                    <Card className="hover:border-brand-gold/50 transition-colors">
                      <Badge variant="secondary">القصص</Badge>
                      <p className="mt-2 text-brand-cream">{fav.item_ref.replace('story:', '')}</p>
                      <p className="text-xs arabic-muted mt-2">
                        {new Date(fav.created_at).toLocaleDateString('ar-EG')}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Other Favorites */}
          {otherFavorites.length > 0 && (
            <section className="space-y-4">
              <SectionHeader 
                title="عناصر أخرى" 
                subtitle={`${otherFavorites.length} عنصر`}
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {otherFavorites.map((fav) => (
                  <Card key={fav.id}>
                    <Badge variant="outline">{typeLabels[fav.item_type] || fav.item_type}</Badge>
                    <p className="mt-2 text-brand-cream">{fav.item_ref}</p>
                    <p className="text-xs arabic-muted mt-2">
                      {new Date(fav.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* CTA */}
      <Card className="text-center py-6 bg-brand-gold/5">
        <p className="arabic-muted leading-7">
          استمر في استكشاف المحتوى وحفظ ما يعجبك للرجوع إليه لاحقاً
        </p>
        <div className="flex justify-center gap-3 mt-4">
          <Button href="/quran" variant="ghost">القرآن</Button>
          <Button href="/hadith" variant="ghost">الأحاديث</Button>
          <Button href="/stories" variant="ghost">القصص</Button>
        </div>
      </Card>
    </Container>
  );
}
