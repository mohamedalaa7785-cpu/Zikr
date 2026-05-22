import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useBehaviorTracker } from "@/hooks/useBehaviorTracker";
import { usePageSEO } from "@/lib/seoHead";
import { useAuth } from "@/_core/hooks/useAuth";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function AssistantPage() {
  useAuth({ redirectOnUnauthenticated: true });
  useBehaviorTracker("/assistant");
  usePageSEO({ title: "Assistant | ZIKR | ذِكرٌ", description: "Private assistant", path: "/assistant", robots: "noindex,nofollow" });

  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const chat = trpc.assistant.chat.useMutation();

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const nextHistory = [...history, { role: "user" as const, content: message }];
    setHistory(nextHistory);
    setMessage("");
    const response = await chat.mutateAsync({ message, history: nextHistory.slice(-10) });
    setHistory((prev) => [...prev, { role: "assistant", content: response.answer }]);
  };

  return (
    <div className="mx-auto max-w-4xl p-6 text-white">
      <Card className="border-slate-700 bg-slate-900">
        <CardHeader><CardTitle>AI Assistant</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-3 h-[420px] space-y-3 overflow-y-auto rounded border border-slate-700 p-3">
            {history.map((msg, idx) => (
              <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
                <span className="text-xs text-slate-400">{msg.role}</span>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="space-y-2">
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask about writing, lessons, and stories..." />
            <Button type="submit" disabled={chat.isPending}>{chat.isPending ? "Thinking..." : "Send"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
