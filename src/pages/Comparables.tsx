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
  computeFairnessScore,
  estimateAnnualOverpayment,
  countCompsBelow,
} from "@/lib/fairness";
import { supabase } from "@/integrations/supabase/client";
import type { ComparablesResponse } from "@/lib/api";
import { ArrowRight, Lock, Sparkles, Loader2, TrendingUp } from "lucide-react";
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
    const score = computeFairnessScore(data.subject, data.cohort);
    return {
      score,
      overpayment: estimateAnnualOverpayment(data.subject, data.cohort),
      compsBelow: countCompsBelow(data.subject, data.comparables),
      band: scoreBand(score),
    };
  }, [data]);

  if (!data) return null;

  const { subject, cohort, comparables, price_cents } = data;
  const overByPct = Math.round(cohort.uniformity_gap_pct * 100);
  const fee = (price_cents / 100).toFixed(0);
  const overAssessed = cohort.appears_over_assessed;

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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SEO title="Your Fairness Check" description="Your property's Fairness Score against comparable homes." path="/comparables" noindex />
      <SiteHeader minimal />
      <main className="flex-1 container mx-auto max-w-4xl px-8 pt-16 pb-20 md:px-12">
        <p className="type-eyebrow-lg">
          Fairness Check · {data.subject.county} County · {data.subject.township} Township
        </p>
        <h2 className="mt-4 type-h2 text-primary">
          {data.subject.address}
        </h2>
        <p className="mt-1 type-body-lg text-slate">PIN <span className="font-semibold text-primary">{data.subject.pin_formatted}</span></p>

        {/* EMAIL GATE */}
        {phase === "email" && (
          <section className="mt-12 rounded-[30px] border border-electric/30 bg-white p-10 shadow-[0_0_20px_0_rgba(29,29,31,0.09)]">
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
                {submitting ? "Checking\u2026" : "Show my score"}
              </Button>
            </form>
            {emailErr && <p className="mt-2 text-sm text-destructive">{emailErr}</p>}
            <p className="mt-4 type-utility text-slate">No spam. We only contact you about your assessment.</p>
          </section>
        )}

        {/* ANALYZING */}
        {phase === "analyzing" && (
          <section className="mt-12 rounded-[30px] border border-border/60 bg-white p-12 text-center shadow-[0_0_20px_0_rgba(29,29,31,0.09)]">
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
            {/* Subject Highlights */}
            <section className="grid gap-4 rounded-[30px] border border-border bg-white p-8 shadow-[0_0_20px_0_rgba(29,29,31,0.09)] sm:grid-cols-4">
              <Stat label="Assessed value" value={`$${subject.assessed_value.toLocaleString()}`} />
              <Stat label="Square feet" value={subject.sqft.toLocaleString()} />
              <Stat label="Year built" value={String(subject.year_built)} />
              <Stat label="Assessment per sqft" value={`$${subject.av_per_sqft.toFixed(2)}`} />
            </section>

            <div className="rounded-[30px] border border-border/60 bg-white p-8 shadow-[0_0_20px_0_rgba(29,29,31,0.09)] sm:p-10">
              <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
                  style={{
                    color: `hsl(var(--score-${metrics.band}-foreground))`,
                    background: `hsl(var(--score-${metrics.band}) / 0.10)`,
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

              {metrics.band !== "good" && (
                <div className="mt-8 rounded-2xl border border-electric/20 bg-electric/5 p-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="hidden h-5 w-5 text-electric sm:block" />
                    <p className="type-utility font-bold uppercase tracking-wider text-electric">
                      {metrics.band === "poor" ? "Significant gap detected" : "Uniformity gap detected"}
                    </p>
                  </div>
                  <p className="mt-4 type-body-sm leading-relaxed text-slate">
                    {metrics.band === "poor" 
                      ? `You appear to be over-assessed by `
                      : `Your assessment is slightly higher (up to `}
                    <span className="font-bold text-primary tabular-nums">{overByPct}%</span>
                    {metrics.band === "poor" 
                      ? ` compared to ` 
                      : `) than `}
                    {cohort.size.toLocaleString()} similar properties in your township.
                    Township median is ${cohort.median_av_per_sqft.toFixed(2)}/sqft.
                    <span className="block mt-2 font-bold text-primary">
                      We found {metrics.compsBelow} comparable homes assessed lower than yours to support your case.
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-[30px] border border-border/60 bg-white p-8 shadow-[0_0_20px_0_rgba(29,29,31,0.09)]">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="type-h3">Comparable evidence</h3>
                  <p className="mt-1 type-utility">
                    {comparables.length} closest matches by structure and location. Addresses unlock in packet.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate">
                  <Lock className="h-3.5 w-3.5" /> Unlock in Toolkit
                </span>
              </div>
              
              <div className="mt-8 overflow-hidden rounded-2xl border border-border/40 bg-[#F7F9FB]">
                <div className="hidden grid-cols-12 gap-4 border-b border-border/40 bg-secondary/40 px-5 py-3 type-utility font-bold uppercase tracking-wider text-slate sm:grid">
                  <div className="col-span-5">Address</div>
                  <div className="col-span-2 text-right">Sqft</div>
                  <div className="col-span-2 text-right">Assessed</div>
                  <div className="col-span-2 text-right">Match</div>
                  <div className="col-span-1"></div>
                </div>
                <ul>
                  {comparables.slice(0, 10).map((c) => {
                    const matchPct = Math.round(c.similarity_score * 100);
                    return (
                      <li
                        key={c.pin}
                        className="grid grid-cols-2 gap-x-4 gap-y-1 border-b border-border/40 px-5 py-4 text-sm last:border-b-0 sm:grid-cols-12 sm:items-center sm:gap-4"
                      >
                        <div className="col-span-2 sm:col-span-5">
                          <p className="type-body-lg-emph text-primary blur-comp select-none">
                            {c.address}
                          </p>
                          <p className="type-utility blur-comp select-none">
                            PIN {c.pin_formatted}
                          </p>
                        </div>
                        <div className="text-left text-slate sm:hidden">Sqft</div>
                        <div className="text-right tabular-nums sm:col-span-2 type-body-sm">{c.sqft.toLocaleString()}</div>
                        <div className="text-left text-slate sm:hidden">Assessed</div>
                        <div className="text-right font-bold tabular-nums sm:col-span-2 type-body-sm">${c.assessed_value.toLocaleString()}</div>
                        <div className="text-left text-slate sm:hidden">Match</div>
                        <div className="sm:col-span-2">
                          <div className="flex items-center justify-end gap-3">
                            <span className="type-utility font-bold text-success">{matchPct}%</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className={`rounded-[30px] border-2 p-8 shadow-[0_0_30px_0_rgba(29,106,255,0.12)] bg-white ${metrics.band !== "good" ? "border-electric" : "border-border"}`}>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="type-h3">
                    {metrics.band === "good" ? "Your assessment looks fair" : metrics.band === "mid" ? "Borderline — Worth checking" : "Get your Pro Se Toolkit"}
                  </h3>
                  <p className="mt-2 type-body-lg text-slate">
                    {metrics.band === "good"
                      ? "We only sell packets to homeowners where the data supports a uniformity gap."
                      : `Full comp data, pre-filled forms, and filing instructions. Flat ${"$"}${fee}.`}
                  </p>
                </div>
                {metrics.band !== "good" ? (
                  <Button asChild intent="primary" size="large" variant="filled" trailingIcon={ArrowRight} className="sm:w-auto">
                    <Link to={`/signup/${data.lookup_id}`}>
                      {`Continue — $${fee}`}
                    </Link>
                  </Button>
                ) : (
                  <Button disabled intent="secondary" size="large" variant="filled" className="sm:w-auto">
                    Not recommended
                  </Button>
                )}
              </div>
              {metrics.band !== "good" && (
                <Button
                  onClick={() => setPremiumOpen(true)}
                  intent="primary"
                  variant="ghost"
                  size="small"
                  className="mt-6 h-auto py-3 text-left sm:text-center"
                >
                  <span className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    <span className="flex items-center gap-2">
                      <Sparkles className="hidden h-4 w-4 text-electric sm:inline-block" />
                      <span>Want the AI Premium review?</span>
                    </span>
                    <span className="font-bold">Join the waitlist</span>
                  </span>
                </Button>
              )}
            </div>

            <p className="w-full text-center type-utility text-slate max-w-2xl mx-auto px-4">
              The Fairness Score and overpayment estimate are preliminary, derived from public county data. The full toolkit contains the official side-by-side analysis you submit with your appeal.
            </p>
          </section>
        )}
      </main>
      <SiteFooter />
      <WaitlistModal open={premiumOpen} onOpenChange={setPremiumOpen} tier="premium" pin={data.subject.pin} lookupId={data.lookup_id} />
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <p className="type-utility uppercase tracking-widest">{label}</p>
    <p className="type-h4 tabular-nums">{value}</p>
  </div>
);

export default Comparables;
