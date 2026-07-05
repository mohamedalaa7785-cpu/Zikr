import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { requireAdmin } from '@/lib/services/admin';
import { supabaseServerAdminRequest } from '@/lib/supabase/server';

interface UserProfile {
  id: string;
  displayName?: string;
  email?: string;
  role?: string;
  createdAt?: string;
}

async function getUsers(): Promise<UserProfile[]> {
  try {
    const users = await supabaseServerAdminRequest<UserProfile[]>('/rest/v1/profiles?select=*', {
      cache: 'no-store',
    });
    return users || [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

async function getUserStats(): Promise<number> {
  try {
    const stats = await supabaseServerAdminRequest<UserProfile[]>(
      '/rest/v1/profiles?select=id&count=exact',
      { cache: 'no-store' }
    );
    return stats?.length || 0;
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return 0;
  }
}

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await getUsers();
  const totalUsers = await getUserStats();

  return (
    <Container className='space-y-8 py-10 text-right'>
      <section className='space-y-3'>
        <h1 className='text-3xl font-bold text-brand-gold'>إدارة المستخدمين</h1>
        <p className='max-w-3xl leading-8 arabic-muted'>
          عرض وإدارة جميع مستخدمي التطبيق، تتبع نشاطهم، والتحكم في الأدوار والصلاحيات
        </p>
      </section>

      <section className='grid gap-4 md:grid-cols-4'>
        <Card>
          <p className='text-sm arabic-muted'>إجمالي المستخدمين</p>
          <strong className='text-3xl text-brand-gold'>{totalUsers}</strong>
        </Card>
        <Card>
          <p className='text-sm arabic-muted'>نشطين هذا الشهر</p>
          <strong className='text-3xl text-brand-gold'>-</strong>
        </Card>
        <Card>
          <p className='text-sm arabic-muted'>معدل الاحتفاظ</p>
          <strong className='text-3xl text-brand-gold'>-</strong>
        </Card>
        <Card>
          <p className='text-sm arabic-muted'>وقت متوسط الجلسة</p>
          <strong className='text-3xl text-brand-gold'>-</strong>
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
                <th className='px-4 py-2'>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className='border-b border-brand-gold/10'>
                  <td className='px-4 py-3'>{user.displayName || 'مستخدم'}</td>
                  <td className='px-4 py-3 text-sm text-brand-cream/70'>{user.email || '-'}</td>
                  <td className='px-4 py-3'>
                    <span className='rounded-full bg-brand-gold/10 px-2 py-1 text-xs text-brand-gold'>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-sm text-brand-cream/70'>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : '-'}
                  </td>
                  <td className='px-4 py-3'>
                    <Button size='sm' variant='outline'>عرض</Button>
                  </td>
                </tr>
              ))}
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
