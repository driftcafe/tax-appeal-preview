import { Link, useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const sample = {
  firstName: "Sarah",
  address: "742 Hawthorne Ln, Wheaton, IL 60187",
  township: "Milton",
  county: "DuPage",
  assessedValue: 138600,
  fairMarketEstimate: 120400,
  gap: 18200,
  estimatedSavings: 1420,
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
        title="Your Property Tax Analysis"
        description="Personalized property tax appeal analysis with comparable properties and estimated savings."
        path="/r/sample"
        noindex
      />
      <SiteHeader />

      <section className="container mx-auto max-w-4xl px-6 pt-16 pb-12">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Preliminary analysis · {s.county} County
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-primary sm:text-5xl">
          {s.firstName}, we believe you may be overpaying by{" "}
          <span className="text-accent">${s.gap.toLocaleString()}</span> in assessed value.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Your home at <span className="text-foreground">{s.address}</span> in{" "}
          {s.township} Township, {s.county} County has an assessed value of{" "}
          <span className="text-foreground tabular-nums">${s.assessedValue.toLocaleString()}</span>.
          Based on three comparable properties in your township, we estimate
          the fair market value at{" "}
          <span className="text-foreground tabular-nums">${s.fairMarketEstimate.toLocaleString()}</span>,
          suggesting an over-assessment of approximately{" "}
          <span className="text-foreground tabular-nums">${s.gap.toLocaleString()}</span> —
          roughly <span className="text-foreground tabular-nums">${s.estimatedSavings.toLocaleString()}</span>{" "}
          in year-one tax savings if successfully appealed.
        </p>
      </section>

      {/* Comparables */}
      <section className="container mx-auto max-w-5xl px-6 py-12">
        <h2 className="font-serif text-2xl text-primary sm:text-3xl">Your comparables</h2>
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
          The methodology applied to your home
        </h2>
        <div className="mt-6 rounded-lg border border-border bg-card p-6 text-sm leading-relaxed text-foreground/90">
          <ul className="space-y-3">
            <li>Comparable median assessment-to-sale ratio: <span className="tabular-nums">33.4%</span></li>
            <li>Subject assessment-to-implied-market ratio: <span className="tabular-nums">{(s.subjectRatio * 100).toFixed(1)}%</span></li>
            <li>Implied fair assessed value: <span className="tabular-nums">${s.fairMarketEstimate.toLocaleString()}</span></li>
            <li>Gap vs. current assessment: <span className="tabular-nums text-accent">${s.gap.toLocaleString()}</span></li>
          </ul>
          <p className="mt-5 text-muted-foreground">
            Based on comparables, we believe this parcel is materially above the
            township median.{" "}
            <Link to="/methodology" className="font-medium text-primary hover:underline">
              Read the full methodology →
            </Link>
          </p>
        </div>
      </section>

      {/* CTAs */}
      <section className="container mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/pricing" className="rounded-lg border border-border bg-card p-5 hover:border-primary">
            <p className="font-serif text-lg text-primary">Get my $149 packet</p>
            <p className="mt-2 text-sm text-muted-foreground">AppealReady — DIY filing.</p>
          </Link>
          <Link to="/pricing" className="rounded-lg border-2 border-accent bg-card p-5">
            <p className="font-serif text-lg text-primary">File for me — no win, no fee</p>
            <p className="mt-2 text-sm text-muted-foreground">AppealManaged — 30% of year-one savings.</p>
          </Link>
          <Link to="/pricing" className="rounded-lg border border-border bg-card p-5 hover:border-primary">
            <p className="font-serif text-lg text-primary">I have a high-value property</p>
            <p className="mt-2 text-sm text-muted-foreground">AppealPremium — includes PTAB escalation.</p>
          </Link>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Not ready yet?{" "}
          <Link to="/coming-soon" className="font-medium text-primary hover:underline">
            Email me my report →
          </Link>
        </p>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Result;
