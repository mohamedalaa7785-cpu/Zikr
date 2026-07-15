export const dynamic = 'force-dynamic';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { requireAdmin } from '@/lib/services/admin';
import { supabaseServerAdminRequest, supabaseServerAdminCount } from '@/lib/supabase/server';
import { updateUserRoleAction } from '../actions';

interface UserProfile {
  id: string;
  display_name: string | null;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

async function getUsers(): Promise<UserProfile[]> {
  try {
    const users = await supabaseServerAdminRequest<UserProfile[]>(
      '/rest/v1/profiles?select=id,display_name,email,role,avatar_url,created_at,updated_at&order=created_at.desc&limit=200',
      { cache: 'no-store' },
    );
    return users || [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

export default async function AdminUsersPage() {
  const currentAdmin = await requireAdmin();
  const [users, totalUsers] = await Promise.all([getUsers(), supabaseServerAdminCount('profiles')]);

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const now = new Date().getTime();
  const thirtyDaysAgoMs = now - 30 * 24 * 60 * 60 * 1000;
  const recentCount = users.filter(
    (u) => u.created_at && new Date(u.created_at).getTime() > thirtyDaysAgoMs,
  ).length;

  return (
    <Container className='space-y-8 py-10 text-right'>
      <section className='space-y-3'>
        <h1 className='text-3xl font-bold text-brand-gold'>إدارة المستخدمين</h1>
        <p className='max-w-3xl leading-8 arabic-muted'>
          عرض وإدارة جميع مستخدمي الموقع والتحكم في الأدوار والصلاحيات
        </p>
      </section>

      <section className='grid gap-4 md:grid-cols-3'>
        <Card>
          <p className='text-sm arabic-muted'>إجمالي المستخدمين</p>
          <strong className='text-3xl text-brand-gold'>{totalUsers}</strong>
        </Card>
        <Card>
          <p className='text-sm arabic-muted'>مسجلون خلال 30 يومًا</p>
          <strong className='text-3xl text-brand-gold'>{recentCount}</strong>
        </Card>
        <Card>
          <p className='text-sm arabic-muted'>عدد الأدمن</p>
          <strong className='text-3xl text-brand-gold'>{adminCount}</strong>
        </Card>
      </section>

      <Card className='space-y-4'>
        <h2 className='text-2xl text-brand-gold'>قائمة المستخدمين</h2>
        <div className='overflow-x-auto'>
          <table className='w-full text-right text-sm'>
            <thead>
              <tr className='border-b border-brand-gold/20'>
                <th className='px-4 py-2'>الاسم</th>
                <th className='px-4 py-2'>البريد الإلكتروني</th>
                <th className='px-4 py-2'>الدور</th>
                <th className='px-4 py-2'>تاريخ التسجيل</th>
                <th className='px-4 py-2'>تغيير الدور</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = user.id === currentAdmin.id;
                const isAdmin = user.role === 'admin';
                return (
                  <tr key={user.id} className='border-b border-brand-gold/10'>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        {user.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.avatar_url}
                            alt=''
                            className='h-8 w-8 rounded-full object-cover ring-1 ring-brand-gold/20'
                          />
                        ) : (
                          <span className='flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-xs text-brand-gold/60 ring-1 ring-brand-gold/20'>
                            {(user.display_name?.[0] ?? user.email?.[0] ?? 'م').toUpperCase()}
                          </span>
                        )}
                        <span>
                          {user.display_name || 'مستخدم'}
                          {isSelf && <span className='mr-1 text-xs text-brand-gold/60'>(أنت)</span>}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-sm text-brand-cream/70'>{user.email || '—'}</td>
                    <td className='px-4 py-3'>
                      <span
                        className={
                          isAdmin
                            ? 'rounded-full bg-brand-gold/20 px-2 py-1 text-xs font-semibold text-brand-gold'
                            : 'rounded-full bg-brand-gold/10 px-2 py-1 text-xs text-brand-cream/70'
                        }
                      >
                        {isAdmin ? 'أدمن' : 'مستخدم'}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-sm text-brand-cream/70'>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('ar-SA') : '—'}
                    </td>
                    <td className='px-4 py-3'>
                      {isSelf ? (
                        <span className='text-xs arabic-muted'>لا يمكن تعديل نفسك</span>
                      ) : (
                        <form action={updateUserRoleAction} className='inline'>
                          <input type='hidden' name='userId' value={user.id} />
                          <input type='hidden' name='role' value={isAdmin ? 'user' : 'admin'} />
                          <Button size='sm' variant='outline' type='submit'>
                            {isAdmin ? 'إزالة صلاحية الأدمن' : 'ترقية إلى أدمن'}
                          </Button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className='py-8 text-center'>
            <p className='arabic-muted'>لا يوجد مستخدمون</p>
          </div>
        )}
      </Card>
    </Container>
  );
}
