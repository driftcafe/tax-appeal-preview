import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WaitlistModal } from "@/components/WaitlistModal";
import { loadLookup } from "@/lib/lookupCache";
import type { ComparablesResponse } from "@/lib/api";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

const Comparables = () => {
  const { lookupId = "" } = useParams<{ lookupId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ComparablesResponse | null>(null);
  const [premiumOpen, setPremiumOpen] = useState(false);

  useEffect(() => {
    const cached = loadLookup(lookupId);
    if (!cached) { navigate("/", { replace: true }); return; }
    setData(cached);
  }, [lookupId, navigate]);

  if (!data) return null;

  const { subject, cohort, comparables, price_cents } = data;
  const overByPct = Math.round(cohort.uniformity_gap_pct * 100);
  const fee = (price_cents / 100).toFixed(0);
  const overAssessed = cohort.appears_over_assessed;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Your assessment comparison" description="Your property's assessment compared to similar homes in your township." path="/comparables" noindex />
      <SiteHeader minimal />
      <main className="container mx-auto max-w-5xl px-6 pt-12 pb-20">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Assessment review · {subject.county.toUpperCase()} County · {subject.township} Township
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          {subject.address}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">PIN {subject.pin_formatted}</p>

        {/* SUBJECT HEADLINE STRIP */}
        <section className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-6 sm:grid-cols-4">
          <Stat label="Assessed value" value={`$${subject.assessed_value.toLocaleString()}`} />
          <Stat label="Square feet" value={subject.sqft.toLocaleString()} />
          <Stat label="Year built" value={String(subject.year_built)} />
          <Stat label="Assessment per sqft" value={`$${subject.av_per_sqft.toFixed(2)}`} />
        </section>

        {/* OVER-ASSESSMENT SIGNAL */}
        <section
          className={`mt-6 rounded-2xl border-2 p-6 sm:p-8 ${
            overAssessed ? "border-accent bg-card" : "border-border bg-secondary/40"
          }`}
        >
          {overAssessed ? (
            <>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-accent" />
                <p className="text-sm font-semibold uppercase tracking-wider text-accent">Uniformity gap detected</p>
              </div>
              <h2 className="mt-3 text-2xl font-bold leading-snug text-primary sm:text-3xl">
                You appear to be over-assessed by{" "}
                <span className="tabular-nums text-accent">{overByPct}%</span>{" "}
                compared to {cohort.size.toLocaleString()} similar properties in your township.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Your assessment per square foot sits at the {Math.round(cohort.subject_av_per_sqft_percentile * 100)}th percentile.
                Township median is ${cohort.median_av_per_sqft.toFixed(2)}/sqft.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-primary">Your assessment looks fair</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Compared to {cohort.size.toLocaleString()} similar properties in your township, your assessment is in line.
                We won't charge for an appeal we don't think will help.
              </p>
            </>
          )}
        </section>

        {/* COMPARABLES GRID */}
        <section className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-semibold text-primary">Comparable properties</h3>
              <p className="mt-1 text-sm text-muted-foreground">{comparables.length} closest matches by structure and location.</p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="hidden grid-cols-12 gap-4 border-b border-border bg-secondary/40 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
              <div className="col-span-4">Address</div>
              <div className="col-span-2 text-right">Sqft</div>
              <div className="col-span-1 text-right">Year</div>
              <div className="col-span-2 text-right">Assessed</div>
              <div className="col-span-2 text-right">They pay less</div>
              <div className="col-span-1 text-right">Match</div>
            </div>
            <ul>
              {comparables.map((c) => {
                const matchPct = Math.round(c.similarity_score * 100);
                return (
                  <li
                    key={c.pin}
                    className="grid grid-cols-2 gap-x-4 gap-y-1 border-b border-border px-5 py-4 text-sm last:border-b-0 sm:grid-cols-12 sm:items-center sm:gap-4"
                  >
                    <div className="col-span-2 sm:col-span-4">
                      <p className="font-medium text-foreground blur-sm select-none" aria-label="Address hidden until purchase">
                        {c.address}
                      </p>
                      <p className="text-xs text-muted-foreground blur-sm select-none" aria-label="PIN hidden until purchase">
                        PIN {c.pin_formatted}
                      </p>
                    </div>
                    <div className="text-left text-muted-foreground sm:hidden">Sqft</div>
                    <div className="text-right tabular-nums sm:col-span-2">{c.sqft.toLocaleString()}</div>
                    <div className="text-left text-muted-foreground sm:hidden">Year</div>
                    <div className="text-right tabular-nums sm:col-span-1">{c.year_built}</div>
                    <div className="text-left text-muted-foreground sm:hidden">Assessed</div>
                    <div className="text-right font-medium tabular-nums sm:col-span-2">${c.assessed_value.toLocaleString()}</div>
                    <div className="text-left text-muted-foreground sm:hidden">They pay less</div>
                    <div className="text-right font-semibold tabular-nums text-accent sm:col-span-2">
                      ${Math.abs(c.av_gap_dollars).toLocaleString()}
                    </div>
                    <div className="text-left text-muted-foreground sm:hidden">Match</div>
                    <div className="sm:col-span-1">
                      <div className="flex items-center justify-end gap-2">
                        <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-secondary sm:block">
                          <div className="h-full bg-accent" style={{ width: `${matchPct}%` }} />
                        </div>
                        <span className="text-xs tabular-nums text-muted-foreground">{matchPct}%</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className={`mt-10 rounded-2xl border-2 ${overAssessed ? "border-accent" : "border-border"} bg-card p-6 sm:p-8`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-primary">
                {overAssessed ? "Get my appeal packet" : "Your assessment looks fair — no charge"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {overAssessed
                  ? "Pre-filled forms, side-by-side analysis, filing instructions. You file it yourself."
                  : "We only sell packets to homeowners with a uniformity gap supported by the data."}
              </p>
            </div>
            {overAssessed ? (
              <Link
                to={`/signup/${data.lookup_id}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 font-semibold text-accent-foreground hover:bg-accent-hover"
              >
                Get my appeal packet — ${fee} <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-md bg-secondary px-6 font-semibold text-muted-foreground"
              >
                Not recommended
              </button>
            )}
          </div>
          {overAssessed && (
            <button
              onClick={() => setPremiumOpen(true)}
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Sparkles className="h-4 w-4" /> Want the AI Premium review? Join the waitlist
            </button>
          )}
        </section>

        <p className="mt-8 text-xs text-muted-foreground">
          Property Tax Appeal AI LLC is not a law firm and does not provide legal advice.
          Comparison is based on publicly available assessor data and uses uniformity (assessment per square foot) — not market valuation.
          The outcome of any appeal is determined by the Assessor's Office and is not guaranteed.
        </p>
      </main>
      <SiteFooter />
      <WaitlistModal open={premiumOpen} onOpenChange={setPremiumOpen} tier="premium" pin={subject.pin} lookupId={data.lookup_id} />
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="mt-1 text-xl font-semibold tabular-nums text-primary">{value}</p>
  </div>
);

export default Comparables;
