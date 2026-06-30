'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { VideoGenerationRequest } from '@/lib/services/video-automation';

export default function AdminVideosPage() {
  const [requests, setRequests] = useState<VideoGenerationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/videos');
      const data = await response.json();
      setRequests(data || []);
    } catch (error) {
      console.error('Failed to load video requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-green-500/20 text-green-400',
    failed: 'bg-red-500/20 text-red-400',
  };

  const statusLabels = {
    pending: 'قيد الانتظار',
    processing: 'جاري المعالجة',
    completed: 'مكتمل',
    failed: 'فشل',
  };

  return (
    <Container className="py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">🎬 إدارة الفيديوهات</h1>
        <p className="text-brand-cream/70">إدارة طلبات توليد الفيديوهات والنشر التلقائي</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'processing', 'completed', 'failed'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'primary' : 'outline'}
            onClick={() => setFilter(status)}
          >
            {status === 'all' ? 'الكل' : statusLabels[status]}
          </Button>
        ))}
      </div>

      {/* Refresh Button */}
      <Button onClick={loadRequests} variant="outline" className="w-full">
        🔄 تحديث
      </Button>

      {/* Loading State */}
      {loading && (
        <Card className="p-8 text-center">
          <p className="text-brand-cream/70">جاري التحميل...</p>
        </Card>
      )}

      {/* Empty State */}
      {!loading && filteredRequests.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-brand-cream/70">لا توجد طلبات</p>
        </Card>
      )}

      {/* Video Requests List */}
      {!loading && filteredRequests.length > 0 && (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="p-6 space-y-4 border-brand-gold/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-brand-gold">{request.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[request.status]}`}>
                      {statusLabels[request.status]}
                    </span>
                  </div>
                  <p className="text-brand-cream/80 text-sm">{request.description}</p>
                  <div className="flex gap-4 text-sm text-brand-cream/60">
                    <span>📁 {request.category}</span>
                    <span>📅 {new Date(request.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              </div>

              {/* Status Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {request.youtubeId && (
                  <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
                    <p className="text-red-400 font-medium">YouTube</p>
                    <p className="text-red-300/70 text-xs break-all">{request.youtubeId}</p>
                  </div>
                )}
                {request.facebookId && (
                  <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                    <p className="text-blue-400 font-medium">Facebook</p>
                    <p className="text-blue-300/70 text-xs break-all">{request.facebookId}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    // Copy ID to clipboard
                    navigator.clipboard.writeText(request.id);
                    alert('تم نسخ المعرف');
                  }}
                >
                  📋 نسخ المعرف
                </Button>
                {request.status === 'failed' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={async () => {
                      // Retry failed request
                      try {
                        await fetch(`/api/admin/videos/${request.id}/retry`, { method: 'POST' });
                        loadRequests();
                      } catch (error) {
                        console.error('Failed to retry:', error);
                      }
                    }}
                  >
                    🔄 إعادة محاولة
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Statistics */}
      <Card className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-brand-gold/10 border-brand-gold/30">
        <div className="text-center space-y-2">
          <p className="text-brand-cream/70 text-sm">إجمالي الطلبات</p>
          <p className="text-2xl font-bold text-brand-gold">{requests.length}</p>
        </div>
        <div className="text-center space-y-2">
          <p className="text-brand-cream/70 text-sm">قيد الانتظار</p>
          <p className="text-2xl font-bold text-yellow-400">{requests.filter(r => r.status === 'pending').length}</p>
        </div>
        <div className="text-center space-y-2">
          <p className="text-brand-cream/70 text-sm">مكتملة</p>
          <p className="text-2xl font-bold text-green-400">{requests.filter(r => r.status === 'completed').length}</p>
        </div>
        <div className="text-center space-y-2">
          <p className="text-brand-cream/70 text-sm">فشل</p>
          <p className="text-2xl font-bold text-red-400">{requests.filter(r => r.status === 'failed').length}</p>
        </div>
      </Card>

      {/* Info */}
      <Card className="p-6 space-y-3 bg-black/30 border-brand-gold/30">
        <h3 className="text-lg font-bold text-brand-gold">ℹ️ معلومات</h3>
        <ul className="space-y-2 text-brand-cream/80 text-sm">
          <li>• يتم معالجة الطلبات تلقائياً بواسطة نظام الأتمتة</li>
          <li>• يمكن نشر الفيديوهات على YouTube و Facebook تلقائياً</li>
          <li>• يتم حفظ معرفات الفيديوهات المنشورة لكل منصة</li>
          <li>• في حالة الفشل، يمكن إعادة محاولة الطلب</li>
        </ul>
      </Card>
    </Container>
  );
}
