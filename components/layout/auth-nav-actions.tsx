'use client';

import { useEffect, useState } from 'react';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/app/auth/actions';
import { createClient } from '@/lib/supabase/client';

type AuthNavActionsProps = {
  initialUser: User | null;
  initialIsAdmin: boolean;
};

export function AuthNavActions({ initialUser, initialIsAdmin }: AuthNavActionsProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);

  useEffect(() => {
    // Guard: if Supabase public env vars are not available at runtime in the
    // browser (e.g. preview sandbox), rely on the server-passed initialUser
    // and skip client-side auth subscription.
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL_FALLBACK;
    if (!supabaseUrl) return;

    const supabase = createClient();

    async function syncUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .maybeSingle();

      setIsAdmin(profile?.role === 'admin');
    }

    void syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsAdmin(false);
        return;
      }
      void syncUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user) {
    return (
      <Button href="/auth/login" className="text-sm">
        تسجيل الدخول
      </Button>
    );
  }

  return (
    <>
      <Button variant="ghost" href="/profile" className="text-sm">
        الملف الشخصي
      </Button>
      {isAdmin && (
        <Button variant="ghost" href="/admin" className="text-sm">
          الأدمن
        </Button>
      )}
      <form action={logoutAction}>
        <Button variant="secondary" type="submit" className="text-sm">
          خروج
        </Button>
      </form>
    </>
  );
}
