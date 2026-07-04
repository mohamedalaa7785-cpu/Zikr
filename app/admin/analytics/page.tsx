'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  date: string;
  users: number;
  sessions: number;
  pageViews: number;
  avgSessionDuration: number;
}

interface TopContent {
  id: string;
  title: string;
  views: number;
  favorites: number;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [topContent, setTopContent] = useState<TopContent[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    totalPageViews: 0,
    avgSessionDuration: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/analytics');
        if (!response.ok) throw new Error('Failed to fetch analytics');
        
        const data = await response.json();
        setAnalyticsData(data.timeline);
        setTopContent(data.topContent);
        setStats(data.stats);
      } catch (error) {
        console.error('Analytics fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8">جاري تحميل التحليلات...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">تحليلات التطبيق</h1>
        <p className="text-gray-600">إحصائيات وبيانات شاملة عن استخدام التطبيق</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString('ar-SA')}</div>
            <p className="text-xs text-gray-500">مستخدم نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">الجلسات النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSessions}</div>
            <p className="text-xs text-gray-500">الآن مباشرة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي مشاهدات الصفحات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPageViews.toLocaleString('ar-SA')}</div>
            <p className="text-xs text-gray-500">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">متوسط مدة الجلسة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSessionDuration.toFixed(1)}m</div>
            <p className="text-xs text-gray-500">دقيقة</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>نشاط المستخدمين</CardTitle>
          <CardDescription>إحصائيات آخر 30 يوماً</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#2563eb" />
              <Line type="monotone" dataKey="sessions" stroke="#7c3aed" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>مشاهدات الصفحات</CardTitle>
          <CardDescription>توزيع مشاهدات الصفحات</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pageViews" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>المحتوى الأكثر شهرة</CardTitle>
          <CardDescription>أكثر المحتويات مشاهدة وإعجاباً</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContent.map((item) => (
              <div key={item.id} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.views} مشاهدة</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.favorites} إعجاب</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
