export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { logoutAction, updateProfileAction } from '@/app/auth/actions';
import Link from 'next/link';

type Favorite = {
  id: string;
  item_type: string;
  item_ref: string;
  created_at: string;
};

type ReadingProgress = {
  id: string;
  scope: string;
  ref: string;
  progress_json: Record<string, unknown>;
  updated_at: string;
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?next=/profile');

  // Fetch profile row (may not exist yet for new OAuth users)
  const { data: profileRows } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .limit(1);

  const profile = profileRows?.[0] ?? null;

  // Favorites
  const { data: favorites } = await supabase
    .from('favorites')
    .select('id, item_type, item_ref, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  // Reading progress
  const { data: readingProgress } = await supabase
    .from('reading_progress')
    .select('id, scope, ref, progress_json, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(20);

  const favList: Favorite[] = favorites ?? [];
  const progressList: ReadingProgress[] = readingProgress ?? [];

  const typeLabels: Record<string, string> = {
    quran: 'القرآن',
    hadith: 'الحديث',
    story: 'القصص',
    scholar: 'العلماء',
    dua: 'الأدعية',
    article: 'المقالات',
    video: 'الفيديوهات',
    poetry: 'الشعر',
  };

  const scopeLabels: Record<string, string> = {
    quran: 'القرآن',
    hadith: 'الحديث',
    stories: 'القصص',
  };

  return (
    <Container className="py-16 space-y-6">
      {/* Profile card */}
      <Card className="space-y-4">
        <h1 className="text-2xl text-brand-gold">الملف الشخصي</h1>
        <p className="arabic-muted">البريد: {user.email ?? 'غير متاح'}</p>

        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt="صورة المستخدم"
              className="h-16 w-16 rounded-full object-cover ring-1 ring-brand-gold/30"
            />
          ) : (
            <div
              className="h-16 w-16 rounded-full bg-black/20 ring-1 ring-brand-gold/30 flex items-center justify-center text-2xl text-brand-gold/50"
              aria-label="صورة افتراضية"
            >
              {(user.email?.[0] ?? 'م').toUpperCase()}
            </div>
          )}
          <p className="arabic-muted text-sm">
            {profile?.display_name ?? 'لم يتم إعداد الاسم بعد.'}
          </p>
        </div>

        <form action={updateProfileAction} className="space-y-3 max-w-md">
          <label className="block text-sm arabic-muted" htmlFor="displayName">
            الاسم المعروض
          </label>
          <input
            id="displayName"
            name="displayName"
            defaultValue={profile?.display_name ?? ''}
            className="w-full rounded-lg bg-black/20 border border-brand-gold/20 p-2 text-brand-cream focus:border-brand-gold focus:outline-none"
          />
          <Button type="submit">حفظ التغييرات</Button>
        </form>

        <form action={logoutAction}>
          <Button type="submit" variant="ghost">
            تسجيل الخروج
          </Button>
        </form>
      </Card>

      {/* Favorites */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl text-brand-gold">المفضلة</h2>
          {favList.length > 0 && (
            <Link href="/favorites" className="text-sm text-brand-gold/70 hover:text-brand-gold transition-colors">
              عرض الكل
            </Link>
          )}
        </div>
        {favList.length === 0 ? (
          <p className="arabic-muted">
            لم تقم بحفظ أي عناصر بعد. تصفح المحتوى وأضف ما يعجبك إلى المفضلة.
          </p>
        ) : (
          <div className="space-y-2">
            {favList.map((fav) => (
              <div
                key={fav.id}
                className="flex items-center justify-between rounded-lg bg-black/20 p-3"
              >
                <div>
                  <span className="text-brand-gold text-xs px-2 py-0.5 rounded-full bg-brand-gold/10">
                    {typeLabels[fav.item_type] ?? fav.item_type}
                  </span>
                  <p className="mt-1 text-brand-cream/90 text-sm">{fav.item_ref}</p>
                </div>
                <span className="text-xs arabic-muted">
                  {new Date(fav.created_at).toLocaleDateString('ar-SA')}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Reading progress */}
      <Card className="space-y-4">
        <h2 className="text-xl text-brand-gold">التقدم في القراءة</h2>
        {progressList.length === 0 ? (
          <p className="arabic-muted">
            لم تبدأ أي قراءة بعد.{' '}
            <Link href="/quran" className="text-brand-gold hover:underline">
              ابدأ بتصفح القرآن
            </Link>{' '}
            لتتبع تقدمك.
          </p>
        ) : (
          <div className="space-y-3">
            {progressList.map((rp) => (
              <div key={rp.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-cream/90">
                    {scopeLabels[rp.scope] ?? rp.scope} — {rp.ref}
                  </span>
                  <span className="text-xs arabic-muted">
                    {new Date(rp.updated_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Container>
  );
}
