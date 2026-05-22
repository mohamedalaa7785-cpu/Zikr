import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBehaviorTracker } from "@/hooks/useBehaviorTracker";
import { usePageSEO } from "@/lib/seoHead";
import { useAuth } from "@/_core/hooks/useAuth";

export default function ResearchRequest() {
  useAuth({ redirectOnUnauthenticated: true });
  useBehaviorTracker("/research-request");
  usePageSEO({ title: "Research Request | ZIKR | ذِكرٌ", description: "Private research request", path: "/research-request", robots: "noindex,nofollow" });

  const [form, setForm] = useState({ title: "", field: "", pages: 3, type: "academic", language: "English" });
  const [result, setResult] = useState("");
  const mutation = trpc.research.request.useMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await mutation.mutateAsync(form);
    setResult(data.content);
  };

  return (
    <div className="mx-auto max-w-4xl p-6 text-white">
      <Card className="border-slate-700 bg-slate-900">
        <CardHeader><CardTitle>AI Research Generator</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={submit}>
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input placeholder="Field" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} required />
            <Input type="number" min={1} max={25} value={form.pages} onChange={(e) => setForm({ ...form, pages: Number(e.target.value) })} required />
            <Input placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
            <Input placeholder="Language" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} required />
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Generating..." : "Generate Research"}</Button>
          </form>
          {result && (
            <div className="mt-6 space-y-3">
              <Textarea value={result} readOnly className="min-h-80" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
