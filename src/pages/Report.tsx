import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { api, ApiError } from "@/lib/api";
import type { ReportResponse } from "@/lib/api";

const Report = () => {
  const { token = "" } = useParams<{ token: string }>();
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.reportByToken(token)
      .then((r) => { if (!cancelled) setReport(r); })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError("Sorry, we couldn't find that report.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      });
    return () => { cancelled = true; };
  }, [token]);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="container mx-auto max-w-2xl px-6 pt-16 pb-20 text-center">
          <h1 className="font-serif text-3xl text-primary">{error}</h1>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="container mx-auto max-w-2xl px-6 pt-16 pb-20 text-center">
          <p className="text-muted-foreground">Loading your report…</p>
        </main>
      </div>
    );
  }

  const deadline = new Date(report.filing.deadline_iso);
  const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / 86400000));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Your appeal packet" description="Download your appeal packet and filing instructions." path={`/r/${token}`} noindex />
      <SiteHeader />
      <main className="container mx-auto max-w-4xl px-6 pt-12 pb-20">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Appeal Packet · {report.property.county.toUpperCase()} County
        </p>
        <h1 className="mt-3 font-serif text-3xl text-primary sm:text-4xl">
          {report.property.address}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">PIN {report.property.pin_formatted}</p>

        <div className="mt-8 rounded-lg border border-accent bg-card p-5">
          <p className="text-sm uppercase tracking-wider text-muted-foreground">Filing deadline</p>
          <p className="mt-1 font-serif text-2xl text-primary">
            {deadline.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {daysLeft} day{daysLeft === 1 ? "" : "s"} remaining · {report.filing.form_name}
          </p>
        </div>

        <h2 className="mt-12 font-serif text-2xl text-primary">Downloads</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <DownloadButton href={report.data_report_pdf_url} label="Lack of Uniformity Report (PDF)" />
          <DownloadButton href={report.appeal_template_url} label="Appeal Template (editable)" />
          <DownloadButton href={report.filing_instructions_url} label="Filing Instructions (PDF)" />
        </div>

        <h2 className="mt-12 font-serif text-2xl text-primary">Comparable properties</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {report.comparables.map((c, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4 text-sm">
              <p className="font-medium text-primary">
                {c.approximate_distance_miles.toFixed(1)} mi {directionLabel(c.direction)}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-y-1 text-muted-foreground">
                <dt>Sq ft</dt><dd className="text-right text-foreground tabular-nums">{c.sqft.toLocaleString()}</dd>
                <dt>Year built</dt><dd className="text-right text-foreground tabular-nums">{c.year_built}</dd>
                <dt>Lot sqft</dt><dd className="text-right text-foreground tabular-nums">{c.lot_sqft.toLocaleString()}</dd>
                <dt>Assessed value</dt><dd className="text-right text-foreground tabular-nums">${c.assessed_value.toLocaleString()}</dd>
                <dt>Match</dt><dd className="text-right text-foreground tabular-nums">{Math.round(c.similarity_score * 100)}%</dd>
              </dl>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-serif text-2xl text-primary">How to file</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-base text-foreground/90">
          <li>Go to <a className="text-primary underline" href="https://www.cookcountyassessor.com" target="_blank" rel="noopener noreferrer">cookcountyassessor.com</a></li>
          <li>Click "Appeals"</li>
          <li>Enter your PIN ({report.property.pin_formatted})</li>
          <li>Upload the PDF report and the editable appeal template</li>
          <li>Submit before the deadline</li>
        </ol>

        <p className="mt-12 text-xs text-muted-foreground">
          Property Tax Appeal AI LLC is not a law firm and does not provide legal advice.
          You file this appeal yourself. The outcome is determined by the Cook County Assessor's Office and is not guaranteed.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
};

const directionLabel = (d: string) => {
  const map: Record<string, string> = { N: "north", S: "south", E: "east", W: "west", NE: "northeast", NW: "northwest", SE: "southeast", SW: "southwest" };
  return map[d.toUpperCase()] ?? d;
};

const DownloadButton = ({ href, label }: { href: string; label: string }) => {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.includes("example.invalid")) {
      e.preventDefault();
      alert("This document is being generated. Check back in a minute.");
    }
  };
  return (
    <a
      href={href}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg border border-border bg-card p-4 text-sm font-medium text-primary hover:border-accent"
    >
      {label}
    </a>
  );
};

export default Report;
