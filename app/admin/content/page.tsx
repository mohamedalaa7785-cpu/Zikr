'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ContentItem {
  id: string;
  title: string;
  type: 'story' | 'article' | 'hadith' | 'dua';
  status: 'published' | 'draft' | 'archived';
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/content');
        if (!response.ok) throw new Error('Failed to fetch content');
        
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Content fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const filteredContent = content.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      story: 'bg-blue-100 text-blue-800',
      article: 'bg-purple-100 text-purple-800',
      hadith: 'bg-orange-100 text-orange-800',
      dua: 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="p-8">جاري تحميل المحتوى...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">إدارة المحتوى</h1>
          <p className="text-gray-600">إدارة جميع محتويات التطبيق</p>
        </div>
        <Button>إضافة محتوى جديد</Button>
      </div>

      <div className="flex gap-2">
        {(['all', 'published', 'draft'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
          >
            {status === 'all' && 'الكل'}
            {status === 'published' && 'منشور'}
            {status === 'draft' && 'مسودة'}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>المحتوى ({filteredContent.length})</CardTitle>
          <CardDescription>جميع محتويات التطبيق والحالة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4 font-semibold">العنوان</th>
                  <th className="text-right py-3 px-4 font-semibold">النوع</th>
                  <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                  <th className="text-right py-3 px-4 font-semibold">المشاهدات</th>
                  <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                  <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{item.title}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadge(item.type)}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(item.status)}`}>
                        {item.status === 'published' && 'منشور'}
                        {item.status === 'draft' && 'مسودة'}
                        {item.status === 'archived' && 'أرشيف'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{item.views.toLocaleString('ar-SA')}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(item.updatedAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">تعديل</Button>
                        <Button variant="outline" size="sm">حذف</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
