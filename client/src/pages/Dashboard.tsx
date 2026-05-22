import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useBehaviorTracker } from "@/hooks/useBehaviorTracker";
import { usePageSEO } from "@/lib/seoHead";

export default function DashboardPage() {
  useAuth({ redirectOnUnauthenticated: true });
  useBehaviorTracker("/dashboard");
  usePageSEO({ title: "Dashboard | ZIKR | ذِكرٌ", description: "Private dashboard", path: "/dashboard", robots: "noindex,nofollow" });

  const { data, isLoading } = trpc.dashboard.mine.useQuery();
  if (isLoading) return <div className="p-6 text-white">Loading dashboard...</div>;

  return (
    <div className="mx-auto grid max-w-6xl gap-4 p-6 text-white lg:grid-cols-2">
      <Card className="border-slate-700 bg-slate-900"><CardHeader><CardTitle>My Research</CardTitle></CardHeader><CardContent>{data?.research?.length ?? 0} items</CardContent></Card>
      <Card className="border-slate-700 bg-slate-900"><CardHeader><CardTitle>My Tasks</CardTitle></CardHeader><CardContent>{data?.tasks?.length ?? 0} items</CardContent></Card>
      <Card className="border-slate-700 bg-slate-900"><CardHeader><CardTitle>Saved Stories</CardTitle></CardHeader><CardContent>{data?.savedStories?.length ?? 0} items</CardContent></Card>
      <Card className="border-slate-700 bg-slate-900"><CardHeader><CardTitle>Payment Status</CardTitle></CardHeader><CardContent>{data?.payments?.[0]?.status ?? "No payments yet"}</CardContent></Card>
      <Card className="border-slate-700 bg-slate-900 lg:col-span-2"><CardHeader><CardTitle>Subscription Plan</CardTitle></CardHeader><CardContent>Plan: {data?.subscription?.plan ?? "free"} / Credits: {data?.subscription?.credits ?? 0}</CardContent></Card>
    </div>
  );
}
