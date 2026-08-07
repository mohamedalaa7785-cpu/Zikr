import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body as Record<string, string>;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'الاسم والبريد والرسالة مطلوبة.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.trim().length > 254) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صالح.' }, { status: 400 });
    }
    if (name.trim().length > 120 || message.trim().length > 5000 || (subject?.trim().length ?? 0) > 200) {
      return NextResponse.json({ error: 'البيانات المدخلة طويلة جداً.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('contacts').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || null,
      message: message.trim(),
      language: 'ar',
      read: false,
      notificationsent: false,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact API]', err);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم.' }, { status: 500 });
  }
}
