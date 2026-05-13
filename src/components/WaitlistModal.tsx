import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from "lucide-react";

type Tier = "premium" | "tax_watch";

import { Button } from "@/components/ui/button";

const COPY: Record<Tier, { title: string; desc: string; cta: string }> = {
  premium: {
    title: "Join the AI Premium waitlist",
    desc: "We'll email you when the AI Premium Review is available. No spam.",
    cta: "Notify me",
  },
  tax_watch: {
    title: "Get notified when Tax Watch launches",
    desc: "Annual monitoring, deadline reminders, and re-runs of your Fairness Score. We'll email you when it's live.",
    cta: "Add me to the list",
  },
};

export const WaitlistModal = ({
  open,
  onOpenChange,
  tier,
  pin,
  lookupId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tier: Tier;
  pin?: string;
  lookupId?: string;
}) => {
  const copy = COPY[tier];
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase.from("waitlist").insert({ email, tier, pin: pin ?? null, lookup_id: lookupId ?? null });
    setSubmitting(false);
    if (err) { setError("Couldn't save your email. Try again."); return; }
    setDone(true);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setDone(false); setEmail(""); setError(null); } }}>
      <DialogContent className="rounded-[30px] p-8">
        <DialogHeader>
          <DialogTitle className="type-h3">{copy.title}</DialogTitle>
          <DialogDescription className="type-body-lg mt-2">{copy.desc}</DialogDescription>
        </DialogHeader>
        {done ? (
          <div className="flex items-start gap-4 rounded-2xl bg-success/10 p-6">
            <CheckCircle2 className="mt-0.5 h-6 w-6 text-success" />
            <p className="type-body-sm text-primary font-medium">You're on the list. We'll be in touch as soon as we launch.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-4">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-14 rounded-xl border-border bg-white text-lg focus:ring-electric/30"
              autoFocus
            />
            {error && <p className="type-utility text-destructive">{error}</p>}
            <Button
              type="submit"
              disabled={submitting}
              intent="primary"
              size="large"
              variant="filled"
              className="w-full"
            >
              {submitting ? "Saving…" : copy.cta}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
