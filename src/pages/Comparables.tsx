import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { loadLookup } from "@/lib/lookupCache";
import type { ComparablesResponse } from "@/lib/api";
import { ArrowRight } from "lucide-react";

const Comparables = () => {
  const { lookupId = "" } = useParams<{ lookupId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ComparablesResponse | null>(null);

  useEffect(() => {
    const cached = loadLookup(lookupId);
    if (!cached) {
      navigate("/", { replace: true });
      return;
    }
    setData(cached);
  }, [lookupId, navigate]);

  if (!data) return null;

  const { subject, cohort, comparables, price_cents } = data;
  const gapPct = Math.round(cohort.uniformity_gap_pct * 100);
  const overAssessed = cohort.appears_over_assessed;
  const priceDollars = (price_cents / 100).toFixed(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Your Assessment Comparison" description="Comparison against similar properties in your township." path="/comparables" noindex />
      <SiteHeader />
      <main className="container mx-auto max-w-5xl px-6 pt-12 pb-20">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Data Report — For Informational Purposes Only · {subject.county.toUpperCase()} County
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-primary sm:text-5xl">
          {overAssessed ? (
            <>You appear to be over-assessed by <span className="text-accent">{gapPct}%</span></>
          ) : (
            <>Your assessment looks fair</>
          )}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          {overAssessed ? (
            <>Compared to <span className="text-foreground tabular-nums">{cohort.size.toLocaleString()}</span> similar properties in {subject.township} Township, your assessment per square foot ranks in the top { Math.max(1, Math.round((1 - cohort.subject_av_per_sqft_percentile) * 100)) }%.</>
          ) : (
            <>Your assessment per square foot is in line with similar properties in {subject.township} Township. No charge.</>
          )}
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <Stat label="Assessed value" value={`$${subject.assessed_value.toLocaleString()}`} />
          <Stat label="Square feet" value={subject.sqft.toLocaleString()} />
          <Stat label="Year built" value={String(subject.year_built)} />
        </div>

        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <Stat label="Your AV / sqft" value={`$${subject.av_per_sqft.toFixed(2)}`} />
          <Stat label="Township median AV / sqft" value={`$${cohort.median_av_per_sqft.toFixed(2)}`} />
          <Stat label="Cohort size" value={cohort.size.toLocaleString()} />
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Subject: {subject.address} · PIN {subject.pin_formatted}
        </p>

        <h2 className="mt-12 font-serif text-2xl text-primary sm:text-3xl">Comparable properties</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Selected by similarity score across square footage, lot size, year built, and class.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {comparables.map((c) => (
            <div key={c.pin} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-primary">{c.address}</p>
                  <p className="text-xs text-muted-foreground">PIN {c.pin_formatted}</p>
                </div>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-primary tabular-nums">
                  {Math.round(c.similarity_score * 100)}% match
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-y-1.5 text-sm text-muted-foreground">
                <dt>Sq ft</dt><dd className="text-right text-foreground tabular-nums">{c.sqft.toLocaleString()}</dd>
                <dt>Year built</dt><dd className="text-right text-foreground tabular-nums">{c.year_built}</dd>
                <dt>Lot sqft</dt><dd className="text-right text-foreground tabular-nums">{c.lot_sqft.toLocaleString()}</dd>
                <dt>Assessed value</dt><dd className="text-right text-foreground tabular-nums">${c.assessed_value.toLocaleString()}</dd>
                <dt className="border-t border-border pt-2 mt-1">They pay less than you by</dt>
                <dd className="border-t border-border pt-2 mt-1 text-right tabular-nums text-accent">${c.av_gap_dollars.toLocaleString()}</dd>
              </dl>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-accent" style={{ width: `${Math.round(c.similarity_score * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border-2 border-accent bg-card p-6">
          {overAssessed ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-serif text-xl text-primary">Get my appeal packet — ${priceDollars}</p>
                <p className="mt-1 text-sm text-muted-foreground">Flat fee. One-time. No percentage of savings.</p>
              </div>
              <Link
                to={`/signup/${data.lookup_id}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-base font-medium text-accent-foreground hover:bg-accent-hover"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <p className="font-serif text-lg text-primary">Your assessment looks fair — no charge.</p>
          )}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Property Tax Appeal AI LLC is not a law firm and does not provide legal advice.
          Data sourced from public county records. Outcome of any appeal is determined by the
          Cook County Assessor's Office and is not guaranteed.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="mt-1 font-serif text-2xl text-primary tabular-nums">{value}</p>
  </div>
);

export default Comparables;
