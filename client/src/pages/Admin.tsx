import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { usePageSEO } from "@/lib/seoHead";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminPage() {
  useAuth({ redirectOnUnauthenticated: true });
  usePageSEO({
    title: "Admin | ZIKR | ذِكرٌ",
    description: "Restricted admin area.",
    path: "/admin",
    robots: "noindex,nofollow",
  });

  const [, navigate] = useLocation();
  return (
    <div className="mx-auto max-w-3xl space-y-3 p-6 text-white">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <p>Moderate payments, subscriptions, and system operations.</p>
      <Button onClick={() => navigate("/admin/payments")}>Manage Payments</Button>
          <Button variant="outline" onClick={() => navigate("/admin/analytics")}>Analytics Dashboard</Button>
    </div>
  );
}
