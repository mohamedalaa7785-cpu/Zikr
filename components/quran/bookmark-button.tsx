'use client';

import { useEffect, useState, useTransition } from 'react';
import { addFavorite, removeFavorite, isFavorite } from '@/app/favorites/actions';
import { toast } from 'sonner';

export function BookmarkButton({ keyRef }: { keyRef: string }) {
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    isFavorite(keyRef).then(setSaved);
  }, [keyRef]);

  const toggle = () => {
    startTransition(async () => {
      if (saved) {
        const res = await removeFavorite(keyRef);
        if (res.error) {
          toast.error('فشل في إزالة المفضلة');
        } else {
          setSaved(false);
          toast.success('تمت الإزالة من المفضلة');
        }
      } else {
        const res = await addFavorite(keyRef);
        if (res.error) {
          if (res.error === 'Unauthorized') {
            toast.error('يرجى تسجيل الدخول لحفظ المفضلة');
          } else {
            toast.error('فشل في إضافة المفضلة');
          }
        } else {
          setSaved(true);
          toast.success('تمت الإضافة إلى المفضلة');
        }
      }
    });
  };

  return (
    <button
      className='text-sm text-brand-gold disabled:opacity-50 hover:scale-110 transition-transform'
      onClick={toggle}
      disabled={isPending}
      title={saved ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
    >
      {saved ? '★ محفوظ' : '☆ حفظ'}
    </button>
  );
}
