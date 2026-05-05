import { Link, useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const sample = {
  address: "742 Hawthorne Ln, Wheaton, IL 60187",
  township: "Milton",
  county: "DuPage",
  assessedValue: 138600,
  comparableMedian: 120400,
  gap: 18200,
  comparables: [
    { dir: "0.2 miles north on Hawthorne Ln", sqft: 2140, year: 1998, lot: 0.24, av: 119400, sale: 358000, saleDate: "May 2024", ratio: 0.333 },
    { dir: "0.4 miles east on Maple Ave", sqft: 2080, year: 2001, lot: 0.22, av: 121800, sale: 362500, saleDate: "Aug 2023", ratio: 0.336 },
    { dir: "0.3 miles west on Elm St", sqft: 2210, year: 1996, lot: 0.26, av: 123500, sale: 371000, saleDate: "Nov 2023", ratio: 0.333 },
  ],
  subjectRatio: 0.396,
};

const Result = () => {
  useParams<{ token: string }>();
  const s = sample;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Your Comparison Report"
        description="Sample data report comparing a property's assessed value to comparable homes from public records."
        path="/r/sample"
        noindex
      />
      <SiteHeader />

      <section className="container mx-auto max-w-4xl px-6 pt-16 pb-12">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Data Report — For Informational Purposes Only · {s.county} County
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-primary sm:text-5xl">
          Your assessed value is{" "}
          <span className="text-accent">${s.gap.toLocaleString()}</span> above the median of comparable homes.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          The property at <span className="text-foreground">{s.address}</span> in{" "}
          {s.township} Township, {s.county} County has a current assessed value of{" "}
          <span className="text-foreground tabular-nums">${s.assessedValue.toLocaleString()}</span>.
          The three comparable properties below — pulled from public county records — have a median
          assessed value of <span className="text-foreground tabular-nums">${s.comparableMedian.toLocaleString()}</span>.
          This is informational data, not a recommendation or prediction of any outcome.
        </p>

        <div className="mt-8 rounded-lg border border-border bg-secondary/40 p-5 text-sm leading-relaxed text-muted-foreground">
          <p className="font-medium text-primary">Required disclaimers</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Property Tax Appeal AI LLC provides data analysis and document preparation services only. We do not provide legal advice, legal representation, or tax consulting.</li>
            <li>All data is derived from publicly available government records. We do not independently verify the accuracy of government data.</li>
            <li>Homeowners are solely responsible for reviewing, editing, and filing all appeal documents.</li>
          </ul>
        </div>
      </section>

      {/* Comparables */}
      <section className="container mx-auto max-w-5xl px-6 py-12">
        <h2 className="font-serif text-2xl text-primary sm:text-3xl">Comparable properties</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {s.comparables.map((c) => (
            <div key={c.dir} className="rounded-lg border border-border bg-card p-5">
              <p className="font-medium text-primary">{c.dir}</p>
              <dl className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                <div className="flex justify-between"><dt>Sq ft</dt><dd className="text-foreground tabular-nums">{c.sqft.toLocaleString()}</dd></div>
                <div className="flex justify-between"><dt>Year built</dt><dd className="text-foreground tabular-nums">{c.year}</dd></div>
                <div className="flex justify-between"><dt>Lot size</dt><dd className="text-foreground tabular-nums">{c.lot} ac</dd></div>
                <div className="flex justify-between"><dt>Assessed value</dt><dd className="text-foreground tabular-nums">${c.av.toLocaleString()}</dd></div>
                <div className="flex justify-between"><dt>Last sale</dt><dd className="text-foreground tabular-nums">${c.sale.toLocaleString()} · {c.saleDate}</dd></div>
                <div className="flex justify-between border-t border-border pt-2 mt-2">
                  <dt>AV / sale ratio</dt>
                  <dd className="text-foreground tabular-nums">{(c.ratio * 100).toFixed(1)}%</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="container mx-auto max-w-4xl px-6 py-12">
        <h2 className="font-serif text-2xl text-primary sm:text-3xl">
          How these numbers were generated
        </h2>
        <div className="mt-6 rounded-lg border border-border bg-card p-6 text-sm leading-relaxed text-foreground/90">
          <ul className="space-y-3">
            <li>Comparable median assessment-to-sale ratio: <span className="tabular-nums">33.4%</span></li>
            <li>Subject assessment-to-implied-market ratio: <span className="tabular-nums">{(s.subjectRatio * 100).toFixed(1)}%</span></li>
            <li>Median comparable assessed value: <span className="tabular-nums">${s.comparableMedian.toLocaleString()}</span></li>
            <li>Difference vs. current assessment: <span className="tabular-nums text-accent">${s.gap.toLocaleString()}</span></li>
          </ul>
          <p className="mt-5 text-muted-foreground">
            Comparables were selected by regression analysis on publicly available
            assessment and sales data, evaluating square footage, lot size, year built,
            and geographic proximity.{" "}
            <Link to="/methodology" className="font-medium text-primary hover:underline">
              Read the full methodology →
            </Link>
          </p>
        </div>
      </section>

      {/* CTAs */}
      <section className="container mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-2">
          <Link to="/pricing" className="rounded-lg border-2 border-accent bg-card p-5">
            <p className="font-serif text-lg text-primary">Get the full report + editable appeal template</p>
            <p className="mt-2 text-sm text-muted-foreground">$149 flat fee. One-time. No percentage of savings.</p>
          </Link>
          <Link to="/pricing" className="rounded-lg border border-border bg-card p-5 hover:border-primary">
            <p className="font-serif text-lg text-primary">Annual Tax Watch</p>
            <p className="mt-2 text-sm text-muted-foreground">$19–$29/year. Get notified when your assessment changes.</p>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Result;
