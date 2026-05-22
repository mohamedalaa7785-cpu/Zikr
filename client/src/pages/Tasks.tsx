import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBehaviorTracker } from "@/hooks/useBehaviorTracker";
import { usePageSEO } from "@/lib/seoHead";
import { useAuth } from "@/_core/hooks/useAuth";

export default function TasksPage() {
  useAuth({ redirectOnUnauthenticated: true });
  useBehaviorTracker("/tasks");
  usePageSEO({ title: "Tasks | ZIKR | ذِكرٌ", description: "Private tasks", path: "/tasks", robots: "noindex,nofollow" });

  const [goal, setGoal] = useState("");
  const generate = trpc.tasks.generate.useMutation();
  const tasks = trpc.tasks.mine.useQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generate.mutateAsync({ goal });
    setGoal("");
    tasks.refetch();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6 text-white">
      <Card className="border-slate-700 bg-slate-900">
        <CardHeader><CardTitle>Task Generator</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Finish project in 2 weeks" required />
            <Button type="submit" disabled={generate.isPending}>{generate.isPending ? "Generating..." : "Generate"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-slate-700 bg-slate-900">
        <CardHeader><CardTitle>My Generated Plans</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {tasks.data?.map((item) => (
            <div key={item.id} className="rounded border border-slate-700 p-3">
              <p className="font-semibold">{item.input}</p>
              <pre className="mt-2 whitespace-pre-wrap text-sm">{item.result}</pre>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
