import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePageSEO } from "@/lib/seoHead";
import { useAuth } from "@/_core/hooks/useAuth";

export default function PaymentPage() {
  useAuth({ redirectOnUnauthenticated: true });
  usePageSEO({ title: "Payment | ZIKR | ذِكرٌ", description: "Private payment area", path: "/payment", robots: "noindex,nofollow" });

  const [amount, setAmount] = useState(15);
  const [method, setMethod] = useState<"Instapay" | "Mobile Wallet">("Instapay");
  const [referenceNote, setReferenceNote] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const submit = trpc.payments.submit.useMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit.mutateAsync({ amount, method, referenceNote, screenshotUrl: screenshotUrl || undefined });
    alert("Payment submitted and pending admin approval.");
    setReferenceNote("");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6 text-white">
      <Card className="border-slate-700 bg-slate-900">
        <CardHeader><CardTitle>Payment Instructions</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Send payment via Instapay or Mobile Wallet.</p>
          <p><strong>Phone:</strong> 01210708572</p>
          <p><strong>WhatsApp:</strong> 01210708572</p>
          <p><strong>Email:</strong> contact@zikr-platform.com</p>
        </CardContent>
      </Card>

      <Card className="border-slate-700 bg-slate-900">
        <CardHeader><CardTitle>Submit Payment Proof</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onSubmit}>
            <Input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Amount" required />
            <select value={method} onChange={(e) => setMethod(e.target.value as "Instapay" | "Mobile Wallet")} className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2">
              <option>Instapay</option>
              <option>Mobile Wallet</option>
            </select>
            <Textarea value={referenceNote} onChange={(e) => setReferenceNote(e.target.value)} placeholder="Reference note" required />
            <Input value={screenshotUrl} onChange={(e) => setScreenshotUrl(e.target.value)} placeholder="Screenshot URL (optional)" />
            <Button type="submit" disabled={submit.isPending}>{submit.isPending ? "Submitting..." : "Submit Payment"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
