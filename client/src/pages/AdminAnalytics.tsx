import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { usePageSEO } from "@/lib/seoHead";

export default function AdminAnalyticsPage() {
  useAuth({ redirectOnUnauthenticated: true });
  usePageSEO({ title: "Admin Analytics | ZIKR | ذِكرٌ", description: "Internal analytics dashboard", path: "/admin/analytics", robots: "noindex,nofollow" });

  const { data, isLoading } = trpc.analytics.admin.useQuery();

  if (isLoading) return <div className="p-6 text-white">Loading analytics...</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-6 text-white">
      <h1 className="text-3xl font-bold text-amber-300">Analytics Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900 border-slate-700"><CardHeader><CardTitle>Page Views</CardTitle></CardHeader><CardContent>{data?.pageViews ?? 0}</CardContent></Card>
        <Card className="bg-slate-900 border-slate-700"><CardHeader><CardTitle>CTR</CardTitle></CardHeader><CardContent>{(data?.ctr ?? 0).toFixed(2)}%</CardContent></Card>
        <Card className="bg-slate-900 border-slate-700"><CardHeader><CardTitle>Vitals tracked</CardTitle></CardHeader><CardContent>{data?.webVitals?.length ?? 0}</CardContent></Card>
      </div>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader><CardTitle>Top Pages</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data?.topPages?.map((p: any) => (
            <div key={p.page} className="flex justify-between border-b border-slate-800 pb-2 text-sm"><span>{p.page}</span><span>{p.views}</span></div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader><CardTitle>Core Web Vitals</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {data?.webVitals?.map((v: any) => (
            <div key={v.interaction} className="flex justify-between"><span>{v.interaction}</span><span>{Number(v.avgTime).toFixed(2)}</span></div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
