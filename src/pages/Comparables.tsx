import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { FairnessGauge } from "@/components/FairnessGauge";
import { WaitlistModal } from "@/components/WaitlistModal";
import { loadLookup, loadEmail, saveEmail } from "@/lib/lookupCache";
import {
  scoreBand,
  scoreBandLabel,
  estimateAnnualOverpayment,
  countCompsBelow,
} from "@/lib/fairness";
import { supabase } from "@/integrations/supabase/client";
import type { ComparablesResponse } from "@/lib/api";
import { ArrowRight, Lock, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  "Pulling assessor records…",
  "Identifying comparable properties…",
  "Calculating uniformity…",
  "Comparing to township median…",
];
const STEP_MS = 4000;

const Comparables = () => {
  const { lookupId = "" } = useParams<{ lookupId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ComparablesResponse | null>(null);
  const [phase, setPhase] = useState<"email" | "analyzing" | "result">("email");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [premiumOpen, setPremiumOpen] = useState(false);

  useEffect(() => {
    const cached = loadLookup(lookupId);
    if (!cached) { navigate("/", { replace: true }); return; }
    setData(cached);
    const existing = loadEmail(lookupId);
    if (existing) { setEmail(existing); setPhase("analyzing"); }
  }, [lookupId, navigate]);

  useEffect(() => {
    if (phase !== "analyzing") return;
    if (stepIdx >= STEPS.length) {
      const t = setTimeout(() => setPhase("result"), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIdx((i) => i + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [phase, stepIdx]);

  const metrics = useMemo(() => {
    if (!data) return null;
    const score = 68; // Temporarily forced to 68 for preview
    return {
      score,
      overpayment: estimateAnnualOverpayment(data.subject, data.cohort),
      compsBelow: countCompsBelow(data.subject, data.comparables),
      band: scoreBand(score),
    };
  }, [data]);

  if (!data) return null;

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setEmailErr("Enter a valid email."); return; }
    setEmailErr(null);
    setSubmitting(true);
    saveEmail(lookupId, email);
    await supabase.from("fairness_emails").insert({ email, lookup_id: data.lookup_id, pin: data.subject.pin });
    setSubmitting(false);
    setPhase("analyzing");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Your Fairness Check" description="Your property's Fairness Score against comparable homes." path="/comparables" noindex />
      <SiteHeader minimal />
      <main className="container mx-auto max-w-4xl px-8 pt-16 pb-20 md:px-12">
        <p className="type-eyebrow-lg">
          Fairness Check · {data.subject.county} County · {data.subject.township} Township
        </p>
        <h1 className="mt-4 type-h1 text-primary">
          {data.subject.address}
        </h1>
        <p className="mt-1 type-body-lg text-slate">PIN <span className="font-semibold text-primary">{data.subject.pin_formatted}</span></p>

        {/* EMAIL GATE */}
        {phase === "email" && (
          <section className="mt-12 rounded-[30px] border border-electric/30 bg-white p-10 shadow-[0_0_20px_0_rgba(29,29,31,0.08)]">
            <p className="type-eyebrow-sm text-electric uppercase">Final Step</p>
            <h2 className="mt-2 type-h2">Where should we send your results?</h2>
            <p className="mt-4 type-body-lg">
              We'll show your Fairness Score on the next screen and email you a breakdown of your township's appeal deadline.
            </p>
            <form onSubmit={submitEmail} className="mt-8 flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Your email"
                className="h-14 flex-1 rounded-xl border border-border bg-card px-4 text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              <Button
                type="submit"
                disabled={submitting}
                intent="primary"
                size="large"
                variant="filled"
                trailingIcon={ArrowRight}
                className="sm:w-auto"
              >
                Show my score
              </Button>
            </form>
            {emailErr && <p className="mt-2 text-sm text-destructive">{emailErr}</p>}
            <p className="mt-4 type-utility text-slate">No spam. We only contact you about your assessment.</p>
          </section>
        )}

        {/* ANALYZING */}
        {phase === "analyzing" && (
          <section className="mt-12 rounded-[30px] border border-border/60 bg-white p-12 text-center shadow-[0_0_20px_0_rgba(29,29,31,0.08)]">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-electric" />
            <h2 className="mt-8 type-h3">Running your Fairness Check</h2>
            <ul className="mx-auto mt-8 max-w-md space-y-3 text-left">
              {STEPS.map((s, i) => (
                <li key={s} className={`flex items-center gap-3 type-body-sm ${i < stepIdx ? "text-primary" : i === stepIdx ? "text-electric font-bold" : "text-slate/40"}`}>
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${i < stepIdx ? "bg-success" : i === stepIdx ? "bg-electric animate-pulse" : "bg-border"}`} />
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* RESULT */}
        {phase === "result" && metrics && (
          <section className="mt-12 space-y-10">
            <div className="rounded-[30px] border border-border/60 bg-white p-8 shadow-[0_0_20px_0_rgba(29,29,31,0.08)] sm:p-10">
              <div className="mb-6 flex items-center gap-4">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
                  style={{
                    color: metrics.band === "good" ? "hsl(var(--score-good))" : metrics.band === "mid" ? "hsl(var(--score-mid))" : "hsl(var(--score-poor))",
                    background: metrics.band === "good" ? "hsl(var(--score-good) / 0.10)" : metrics.band === "mid" ? "hsl(var(--score-mid) / 0.10)" : "hsl(var(--score-poor) / 0.10)",
                  }}
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-current" />
                  {scoreBandLabel(metrics.score)}
                </span>
                <span className="type-utility text-slate">
                  {data.cohort.size} comparable homes analyzed
                </span>
              </div>

              <FairnessGauge
                mode="compare"
                score={metrics.score}
                subjectAV={data.subject.assessed_value}
                subjectSqft={data.subject.sqft}
                cohortMedianAVPerSqft={data.cohort.median_av_per_sqft}
                overpayment={metrics.overpayment}
              />

              {metrics.band === "poor" && (
                <div className="mt-8 rounded-2xl border border-border/60 bg-secondary/30 p-6">
                  <p className="type-body-sm leading-relaxed text-slate">
                    <span className="font-bold text-primary">What this means:</span> Your home is assessed
                    at a higher value per square foot than comparable homes in your township. Illinois law
                    allows you to appeal on the basis of this lack of uniformity — and{" "}
                    <span className="font-bold text-primary">
                      we found {metrics.compsBelow} comparable homes
                      assessed lower than yours to support your case.
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-[30px] border border-border/60 bg-white p-8 shadow-[0_0_20px_0_rgba(29,29,31,0.08)]">
              <div className="flex items-center justify-between">
                <h3 className="type-h3">Comparable evidence</h3>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate">
                  <Lock className="h-3.5 w-3.5" /> Unlock in Toolkit
                </span>
              </div>
              <div className="mt-6 space-y-3">
                {data.comparables.slice(0, 7).map((c, i) => (
                  <div key={c.pin} className="flex items-center justify-between rounded-xl border border-border/40 bg-[#F7F9FB] px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="type-body-lg-emph text-primary blur-comp">{c.address}</p>
                      <p className="type-utility text-slate">{c.sqft.toLocaleString()} sqft · built {c.year_built}</p>
                    </div>
                    <div className="text-right">
                      <p className="type-body-lg-emph text-primary blur-comp">${c.assessed_value.toLocaleString()}</p>
                      <p className="type-utility text-success font-bold">{Math.round(c.similarity_score * 100)}% match</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border-2 border-electric bg-white p-8 shadow-[0_0_30px_0_rgba(29,106,255,0.12)]">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="type-h3">Get your Pro Se Toolkit</h3>
                  <p className="mt-2 type-body-lg text-slate">Full comp data, pre-filled forms, and filing instructions. Flat $149.</p>
                </div>
                <Button asChild intent="primary" size="large" variant="filled" trailingIcon={ArrowRight} className="sm:w-auto">
                  <Link to={`/signup/${data.lookup_id}`}>
                    Continue &mdash; $149
                  </Link>
                </Button>
              </div>
              <Button
                onClick={() => setPremiumOpen(true)}
                intent="primary"
                variant="ghost"
                size="small"
                leadingIcon={Sparkles}
                className="mt-6"
              >
                Want the AI Premium review? Join the waitlist
              </Button>
            </div>

            <p className="text-center type-utility text-slate max-w-2xl mx-auto">
              The Fairness Score and overpayment estimate are preliminary, derived from public county data. The full $149 packet contains the official side-by-side analysis you submit with your appeal.
            </p>
          </section>
        )}
      </main>
      <SiteFooter />
      <WaitlistModal open={premiumOpen} onOpenChange={setPremiumOpen} tier="premium" pin={data.subject.pin} lookupId={data.lookup_id} />
    </div>
  );
};

export default Comparables;
