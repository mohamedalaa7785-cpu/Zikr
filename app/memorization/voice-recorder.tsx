'use client';

import { useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { evaluateMemorizationAction } from './actions';

export function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [result, setResult] = useState<string>('');
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
      setAudioBlob(blob);
      stream.getTracks().forEach((track) => track.stop());
    };
    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setIsRecording(false);
  }

  function submitEvaluation(formData: FormData) {
    if (audioBlob) formData.set('audio', new File([audioBlob], 'tasmee.webm', { type: audioBlob.type || 'audio/webm' }));
    startTransition(async () => {
      const evaluation = await evaluateMemorizationAction(formData);
      setResult(evaluation);
    });
  }

  return <form action={submitEvaluation} className='space-y-4'>
    <div className='grid gap-3 md:grid-cols-2'>
      <label className='space-y-1 text-sm arabic-muted'>
        <span>المقرر</span>
        <input name='target' placeholder='مثال: سورة الملك 1-10' className='w-full rounded-lg bg-black/20 p-2 text-brand-cream' />
      </label>
      <label className='space-y-1 text-sm arabic-muted'>
        <span>سؤال أكمل / النص المتوقع</span>
        <input name='expectedText' placeholder='اكتب بداية الآية أو الورد المطلوب' className='w-full rounded-lg bg-black/20 p-2 text-brand-cream' />
      </label>
    </div>

    <div className='flex flex-wrap items-center gap-3'>
      <Button type='button' onClick={isRecording ? stopRecording : startRecording} variant={isRecording ? 'secondary' : 'primary'}>
        {isRecording ? 'إيقاف التسجيل' : 'ابدأ تسجيل التسميع'}
      </Button>
      <Button type='submit' disabled={!audioBlob || isPending}>تقييم الحفظ والتجويد</Button>
      {audioBlob ? <span className='text-sm text-emerald-300'>تم تسجيل الصوت وجاهز للتقييم.</span> : <span className='text-sm arabic-muted'>اسمح للمتصفح باستخدام الميكروفون.</span>}
    </div>

    {result ? (
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-bold text-brand-gold'>نتائج التقييم:</h3>
          <div className='flex gap-2'>
            <Button 
              type='button' 
              variant='secondary' 
              size='sm' 
              onClick={() => {
                navigator.clipboard.writeText(result);
                alert('تم نسخ التقييم');
              }}
            >
              نسخ التقييم
            </Button>
            <Button 
              type='button' 
              variant='secondary' 
              size='sm' 
              onClick={() => setResult('')}
            >
              مسح
            </Button>
          </div>
        </div>
        <div className='relative group'>
          <div className={`rounded-xl border border-brand-gold/25 bg-black/20 p-4 leading-8 whitespace-pre-wrap transition-all duration-300 ${!expanded && result.length > 300 ? 'max-h-48 overflow-hidden' : ''}`}>
            {result}
            {!expanded && result.length > 300 && (
              <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-2'>
                <Button type='button' variant='secondary' size='sm' onClick={() => setExpanded(true)}>عرض المزيد</Button>
              </div>
            )}
          </div>
          {expanded && result.length > 300 && (
            <div className='mt-2 text-center'>
              <Button type='button' variant='secondary' size='sm' onClick={() => setExpanded(false)}>عرض أقل</Button>
            </div>
          )}
        </div>
      </div>
    ) : null}
  </form>;
}
