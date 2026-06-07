import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { logoutAction, updateProfileAction } from '@/app/auth/actions';
import { supabaseServerAnonRequest } from '@/lib/supabase/server';
import Link from 'next/link';

type Favorite = {
  id: string;
  item_type: string;
  item_id: string;
  item_title: string;
  created_at: string;
};

type ReadingProgress = {
  id: string;
  content_type: string;
  content_id: string;
  progress: number;
  updated_at: string;
};

export default async function ProfilePage() {
  const token = (await cookies()).get('sb_access_token')?.value;
  if (!token) redirect('/auth/login');

  const user = await supabaseServerAnonRequest<{ id: string; email?: string }>('/auth/v1/user', {
    headers: { Authorization: `Bearer ${token}` },
  });

  const profiles = await supabaseServerAnonRequest<Array<{ display_name: string | null; avatar_url: string | null }>>(
    `/rest/v1/profiles?select=display_name,avatar_url&id=eq.${user.id}&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const profile = profiles[0];

  let favorites: Favorite[] = [];
  let readingProgress: ReadingProgress[] = [];

  try {
    favorites = await supabaseServerAnonRequest<Favorite[]>(
      `/rest/v1/favorites?select=id,item_type,item_id,item_title,created_at&user_id=eq.${user.id}&order=created_at.desc&limit=20`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch {
    favorites = [];
  }

  try {
    readingProgress = await supabaseServerAnonRequest<ReadingProgress[]>(
      `/rest/v1/reading_progress?select=id,content_type,content_id,progress,updated_at&user_id=eq.${user.id}&order=updated_at.desc&limit=20`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch {
    readingProgress = [];
  }

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

  const progressLabels: Record<string, string> = {
    quran: 'القرآن',
    hadith: 'الحديث',
    story: 'القصص',
    memorization: 'الحفظ',
    article: 'المقالات',
  };

  return (
    <Container className="py-16 space-y-6">
      <Card className="space-y-4">
        <h1 className="text-2xl text-brand-gold">الملف الشخصي</h1>
        <p className="arabic-muted">البريد: {user.email ?? 'غير متاح'}</p>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-black/20 ring-1 ring-brand-gold/30" aria-label="avatar placeholder" />
          <p className="arabic-muted">
            {profile?.avatar_url ? 'تم إعداد صورة شخصية.' : 'لم يتم إعداد صورة شخصية بعد.'}
          </p>
        </div>
        <form action={updateProfileAction} className="space-y-3 max-w-md">
          <label className="block text-sm arabic-muted">الاسم المعروض</label>
          <input name="displayName" defaultValue={profile?.display_name ?? ''} className="w-full rounded-lg bg-black/20 p-2" />
          <Button type="submit">حفظ التغييرات</Button>
        </form>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost">تسجيل الخروج</Button>
        </form>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl text-brand-gold">المفضلة</h2>
          {favorites.length > 0 && (
            <Link href="/favorites" className="text-sm text-brand-gold/70 hover:text-brand-gold">
              عرض الكل
            </Link>
          )}
        </div>
        {favorites.length === 0 ? (
          <p className="arabic-muted">لم تقم بحفظ أي عناصر بعد. تصفح المحتوى وأضف ما يعجبك إلى المفضلة.</p>
        ) : (
          <div className="space-y-2">
            {favorites.map((fav) => (
              <div key={fav.id} className="flex items-center justify-between rounded-lg bg-black/20 p-3">
                <div>
                  <span className="text-brand-gold text-xs px-2 py-0.5 rounded-full bg-brand-gold/10">
                    {typeLabels[fav.item_type] ?? fav.item_type}
                  </span>
                  <p className="mt-1 text-brand-cream/90">{fav.item_title}</p>
                </div>
                <span className="text-xs arabic-muted">
                  {new Date(fav.created_at).toLocaleDateString('ar-SA')}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="space-y-4">
        <h2 className="text-xl text-brand-gold">التقدم في القراءة</h2>
        {readingProgress.length === 0 ? (
          <p className="arabic-muted">لم تبدأ أي قراءة بعد. ابدأ بتصفح القرآن والقصص لتتبع تقدمك.</p>
        ) : (
          <div className="space-y-3">
            {readingProgress.map((rp) => (
              <div key={rp.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-cream/90">
                    {progressLabels[rp.content_type] ?? rp.content_type} - {rp.content_id}
                  </span>
                  <span className="text-brand-gold">{Math.round(rp.progress)}%</span>
                </div>
                <div className="h-2 rounded-full bg-black/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-gold/60 transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, rp.progress))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Container>
  );
}
