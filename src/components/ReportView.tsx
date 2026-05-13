import type { ReportResponse } from "@/lib/api";

const directionLabel = (d: string) => {
  const map: Record<string, string> = {
    N: "north", S: "south", E: "east", W: "west",
    NE: "northeast", NW: "northwest", SE: "southeast", SW: "southwest",
  };
  return map[d.toUpperCase()] ?? d;
};

const DownloadButton = ({ href, label }: { href: string; label: string }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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

export const ReportView = ({
  report,
  customerEmail,
}: {
  report: ReportResponse;
  customerEmail?: string | null;
}) => {
  const deadline = new Date(report.filing.deadline_iso);
  const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / 86400000));

  return (
    <>
      <p className="text-sm uppercase tracking-wider text-muted-foreground">
        Appeal Packet · {report.property.county.toUpperCase()} County
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
        {report.property.address}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">PIN {report.property.pin_formatted}</p>

      <div className="mt-8 rounded-lg border border-accent bg-card p-5">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">Filing deadline</p>
        <p className="mt-1 text-2xl font-semibold text-primary">
          {deadline.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {daysLeft} day{daysLeft === 1 ? "" : "s"} remaining · {report.filing.form_name}
        </p>
      </div>

      {customerEmail && (
        <p className="mt-6 rounded-md border border-border bg-secondary/40 p-3 text-sm text-foreground/90">
          We've also sent this packet to <span className="font-medium text-primary">{customerEmail}</span>.
          Reply to that email any time if you have questions.
        </p>
      )}

      <h2 className="mt-12 text-2xl font-semibold text-primary">Downloads</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <DownloadButton href={report.data_report_pdf_url} label="Lack of Uniformity Report (PDF)" />
        <DownloadButton href={report.appeal_template_url} label="Appeal Template (editable)" />
        <DownloadButton href={report.filing_instructions_url} label="Filing Instructions (PDF)" />
      </div>

      <h2 className="mt-12 text-2xl font-semibold text-primary">Comparable properties</h2>
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

      <h2 className="mt-12 text-2xl font-semibold text-primary">How to file</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-base text-foreground/90">
        <li>Go to <a className="text-primary underline" href="https://www.cookcountyassessor.com" target="_blank" rel="noopener noreferrer">cookcountyassessor.com</a></li>
        <li>Click "Appeals"</li>
        <li>Enter your PIN ({report.property.pin_formatted})</li>
        <li>Upload the PDF report and the editable appeal template</li>
        <li>Submit before the deadline</li>
      </ol>

      <div className="mt-12 rounded-lg border border-border bg-secondary/40 p-5 text-sm text-foreground/90">
        <p className="font-medium text-primary">Need help?</p>
        <p className="mt-1">
          Reply to your packet email, or write to{" "}
          <a href="mailto:support@taxappeal.app" className="text-primary underline">support@taxappeal.app</a>.
        </p>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Property Tax Appeal AI LLC is not a law firm and does not provide legal advice.
        You file this appeal yourself. The outcome is determined by the Cook County Assessor's Office and is not guaranteed.
      </p>
    </>
  );
};