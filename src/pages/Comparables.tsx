import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { FairnessGauge } from "@/components/FairnessGauge";
import { WaitlistModal } from "@/components/WaitlistModal";
import { loadLookup, loadEmail, saveEmail } from "@/lib/lookupCache";
import {
  computeFairnessScore,
  estimateAnnualOverpayment,
  countCompsBelow,
  scoreBand,
  scoreBandLabel,
  NEIGHBORHOOD_BASELINE,
} from "@/lib/fairness";
import { supabase } from "@/integrations/supabase/client";
import type { ComparablesResponse } from "@/lib/api";
import { ArrowRight, Lock, Sparkles, Loader2 } from "lucide-react";

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

  // Animation sequence
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
    const score = computeFairnessScore(data.subject, data.cohort);
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
      <main className="container mx-auto max-w-4xl px-6 pt-12 pb-20">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Fairness Check · {data.subject.county} County · {data.subject.township} Township
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          {data.subject.address}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">PIN {data.subject.pin_formatted}</p>

        {/* EMAIL GATE */}
        {phase === "email" && (
          <section className="mt-10 rounded-2xl border-2 border-accent bg-card p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">One step</p>
            <h2 className="mt-2 text-2xl font-bold text-primary">Where should we send your Fairness Score?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll show your score on the next screen and email you a copy plus your township's appeal deadline.
            </p>
            <form onSubmit={submitEmail} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Your email"
                className="h-12 flex-1 rounded-md border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 font-semibold text-accent-foreground hover:bg-accent-hover disabled:opacity-60"
              >
                Show my score <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            {emailErr && <p className="mt-2 text-sm text-destructive">{emailErr}</p>}
            <p className="mt-3 text-xs text-muted-foreground">No spam. We only contact you about your assessment.</p>
          </section>
        )}

        {/* ANALYZING */}
        {phase === "analyzing" && (
          <section className="mt-10 rounded-2xl border border-border bg-card p-10 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-accent" />
            <h2 className="mt-6 text-xl font-semibold text-primary">Running your Fairness Check</h2>
            <ul className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm">
              {STEPS.map((s, i) => (
                <li key={s} className={`flex items-center gap-2 ${i < stepIdx ? "text-foreground" : i === stepIdx ? "text-primary font-medium" : "text-muted-foreground/50"}`}>
                  <span className={`inline-block h-2 w-2 rounded-full ${i < stepIdx ? "bg-accent" : i === stepIdx ? "bg-accent animate-pulse" : "bg-border"}`} />
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* RESULT */}
        {phase === "result" && metrics && (
          <section className="mt-10 space-y-8">
            {/* Comparison meter */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="mb-6">
                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{
                    color:
                      metrics.band === "good"
                        ? "hsl(var(--score-good))"
                        : metrics.band === "mid"
                        ? "hsl(var(--accent-hover))"
                        : "hsl(var(--score-poor))",
                  }}
                >
                  {scoreBandLabel(metrics.score)}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-primary sm:text-3xl">
                  {data.subject.address}
                </h2>
              </div>

              <FairnessGauge
                mode="compare"
                score={metrics.score}
                subjectAV={data.subject.assessed_value}
                subjectSqft={data.subject.sqft}
                cohortMedianAVPerSqft={data.cohort.median_av_per_sqft}
                overpayment={metrics.overpayment}
              />

              {/* Contextual explanation */}
              {metrics.band === "poor" && (
                <p className="mt-5 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm leading-relaxed text-foreground/90">
                  <span className="font-semibold text-primary">What this means:</span> Your home is assessed
                  at a higher value per square foot than comparable homes in your township. Illinois law
                  allows you to appeal on the basis of this lack of uniformity — and we found{" "}
                  <span className="font-semibold text-primary">{metrics.compsBelow}</span> comparable homes
                  assessed lower than yours to support your case.
                </p>
              )}
            </div>

            {/* Blurred comps */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">Comparable homes assessed lower</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" /> Unlock with packet
                </span>
              </div>
              <div className="mt-5 space-y-2">
                {data.comparables.slice(0, 7).map((c, i) => (
                  <div key={c.pin} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground blur-comp">{c.address}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">{c.sqft.toLocaleString()} sqft · built {c.year_built}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold tabular-nums text-foreground blur-comp">${c.assessed_value.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">{Math.round(c.similarity_score * 100)}% match</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Confidence: <span className="font-medium text-primary">{data.cohort.size >= 50 ? "Strong" : data.cohort.size >= 20 ? "Moderate" : "Preliminary"}</span> · {data.cohort.size} comps in cohort
              </p>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border-2 border-accent bg-card p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary">Unlock my full appeal packet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Full comp data, pre-filled forms, filing instructions. Flat $149.</p>
                </div>
                <Link
                  to={`/signup/${data.lookup_id}`}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-electric px-6 font-semibold text-electric-foreground hover:bg-electric-hover transition-colors"
                >
                  Continue &mdash; $149 <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <button
                onClick={() => setPremiumOpen(true)}
                className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Sparkles className="h-4 w-4" /> Want the AI Premium review? Join the waitlist
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
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
