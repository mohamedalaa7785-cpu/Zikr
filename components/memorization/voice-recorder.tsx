'use client';

import { useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { evaluateMemorizationAction } from '@/app/memorization/actions';

export function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [result, setResult] = useState<string>('');
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    try {
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
      setResult('');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('يرجى السماح بالوصول للميكروفون لتتمكن من التسجيل.');
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setIsRecording(false);
  }

  function submitEvaluation(formData: FormData) {
    if (audioBlob) {
      formData.set('audio', new File([audioBlob], 'tasmee.webm', { type: audioBlob.type || 'audio/webm' }));
    }
    startTransition(async () => {
      const evaluation = await evaluateMemorizationAction(formData);
      setResult(evaluation);
    });
  }

  return (
    <div className="space-y-10">
      <Card className="p-8 bg-black/40 border-brand-gold/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand-gold/5 rounded-br-full -ml-16 -mt-16" />
        
        <form action={submitEvaluation} className="space-y-8 relative">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 text-right" dir="rtl">
              <label className="text-sm font-bold text-brand-gold uppercase tracking-widest">المقرر المراد تسميعه</label>
              <input 
                name="target" 
                placeholder="مثال: سورة الملك 1-10" 
                className="w-full rounded-xl border border-brand-gold/10 bg-black/40 p-4 text-brand-cream focus:border-brand-gold/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/20 transition-all" 
              />
            </div>
            <div className="space-y-2 text-right" dir="rtl">
              <label className="text-sm font-bold text-brand-gold uppercase tracking-widest">سؤال أكمل / النص المتوقع</label>
              <input 
                name="expectedText" 
                placeholder="اكتب بداية الآية أو الورد المطلوب" 
                className="w-full rounded-xl border border-brand-gold/10 bg-black/40 p-4 text-brand-cream focus:border-brand-gold/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/20 transition-all" 
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              {isRecording && (
                <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
              )}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center text-3xl transition-all shadow-2xl ${
                  isRecording 
                    ? 'bg-red-500 text-white hover:bg-red-600 scale-110' 
                    : 'bg-brand-gold text-black hover:bg-brand-goldSoft hover:scale-105'
                }`}
              >
                {isRecording ? '⏹️' : '🎙️'}
              </button>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg font-bold text-brand-cream">
                {isRecording ? 'جاري التسجيل... اضغط للإيقاف' : audioBlob ? 'تم تسجيل الصوت بنجاح' : 'اضغط على الميكروفون للبدء'}
              </p>
              <p className="text-sm text-brand-cream/40">
                {isRecording ? 'تحدث بوضوح وبتؤدة' : audioBlob ? 'يمكنك الآن طلب التقييم أو إعادة التسجيل' : 'يرجى تفعيل صلاحية الميكروفون'}
              </p>
            </div>

            <div className="flex gap-4 w-full max-w-md">
              <Button 
                type="submit" 
                disabled={!audioBlob || isPending || isRecording}
                className="flex-1 py-8 text-lg bg-brand-gold text-black hover:bg-brand-goldSoft rounded-2xl shadow-lg disabled:opacity-30"
              >
                {isPending ? (
                  <span className="flex items-center gap-3">
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    جاري التحليل...
                  </span>
                ) : 'طلب تقييم الذكاء الاصطناعي ✨'}
              </Button>
              {audioBlob && !isPending && !isRecording && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setAudioBlob(null); setResult(''); }}
                  className="border-brand-gold/20 text-brand-gold hover:bg-brand-gold/10 rounded-2xl px-6"
                >
                  إعادة 🔄
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>

      {/* Results Section */}
      {result && (
        <Card className="p-8 md:p-12 border-brand-gold/20 bg-gradient-to-br from-brand-gold/10 to-black relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute top-0 right-0 p-6 opacity-10 text-7xl">📜</div>
          
          <div className="relative space-y-8">
            <div className="flex items-center justify-between border-b border-brand-gold/10 pb-6">
              <div className="flex items-center gap-4">
                <Badge className="bg-brand-gold text-black px-4 py-1 rounded-full font-bold">تقييم ذكي</Badge>
                <span className="text-xs text-brand-cream/30 uppercase tracking-widest font-medium">تم بواسطة Gemini AI</span>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    alert('تم نسخ التقييم إلى الحافظة');
                  }}
                  className="text-brand-gold hover:bg-brand-gold/10"
                >
                  نسخ 📋
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult('')}
                  className="text-red-400 hover:bg-red-400/10"
                >
                  مسح 🗑️
                </Button>
              </div>
            </div>

            <div className="relative group">
              <div 
                className={`text-xl leading-[1.8] font-arabic text-brand-cream text-right whitespace-pre-wrap transition-all duration-500 ${
                  !expanded && result.length > 500 ? 'max-h-[400px] overflow-hidden' : ''
                }`} 
                dir="rtl"
              >
                {result}
              </div>
              
              {!expanded && result.length > 500 && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-center pb-4">
                  <Button 
                    variant="secondary" 
                    className="bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30 border border-brand-gold/30 px-8"
                    onClick={() => setExpanded(true)}
                  >
                    قراءة التقييم كاملاً 👇
                  </Button>
                </div>
              )}
              
              {expanded && result.length > 500 && (
                <div className="mt-8 text-center">
                  <Button 
                    variant="ghost" 
                    className="text-brand-gold/60 hover:text-brand-gold"
                    onClick={() => setExpanded(false)}
                  >
                    طي التقييم ↑
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
