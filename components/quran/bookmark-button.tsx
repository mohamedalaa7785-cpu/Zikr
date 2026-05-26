'use client';
import { useEffect, useState } from 'react';
export function BookmarkButton({ keyRef }: { keyRef: string }) {
  const [saved,setSaved]=useState(false);
  useEffect(()=>{setSaved(localStorage.getItem(`fav:${keyRef}`)==='1');},[keyRef]);
  return <button className='text-sm text-brand-gold' onClick={()=>{const n=!saved;setSaved(n);localStorage.setItem(`fav:${keyRef}`,n?'1':'0');}}>{saved?'★ محفوظ':'☆ حفظ'}</button>
}
