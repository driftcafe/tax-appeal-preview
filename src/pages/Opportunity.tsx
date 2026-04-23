import { CTAButton } from "@/components/CTAButton";
import { SiteFooter } from "@/components/SiteFooter";
import { sampleOpportunity } from "@/data/opportunity";
import { Link } from "react-router-dom";

const confidenceStyles: Record<string, string> = {
  Strong: "bg-confidence-strong-bg text-confidence-strong",
  Moderate: "bg-confidence-moderate-bg text-confidence-moderate",
  Preliminary: "bg-confidence-preliminary-bg text-confidence-preliminary",
};

const fmt = (n: number) => `$${n.toLocaleString()}`;

const Opportunity = () => {
  const o = sampleOpportunity;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Tiny brand wordmark — no hero banner */}
      <div className="container mx-auto max-w-4xl px-6 pt-6">
        <Link to="/" className="font-serif text-sm font-semibold text-primary">
          Kankakee Appeals
        </Link>
      </div>

      {/* Personalized intro + the NUMBER */}
      <section className="container mx-auto max-w-4xl px-6 pt-10 pb-12 sm:pt-16">
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Hello {o.ownerFirstName}. This is about{" "}
          <span className="text-foreground">{o.siteAddress}</span>, parcel{" "}
          <span className="text-foreground">{o.pin}</span>.
        </p>

        <h1 className="mt-8 font-serif text-[44px] leading-[1.05] tracking-tight text-primary sm:text-6xl md:text-7xl lg:text-[88px]">
          We believe your {o.assessmentYear} assessment is about{" "}
          <span className="text-accent">{fmt(o.assessedValueGap)}</span> too high.
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-foreground/90 sm:text-xl">
          That's roughly{" "}
          <span className="font-semibold">{fmt(o.estimatedYearOneTaxSavings)}</span>{" "}
          per year in property tax you may not owe.
        </p>

        <div className="mt-6">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${confidenceStyles[o.confidence]}`}
          >
            {o.confidence} confidence
          </span>
        </div>

        <div className="mt-10 flex flex-col items-start gap-3">
          <CTAButton href="mailto:hello@kankakeeappeals.com?subject=Start my appeal">
            Start my appeal — 3 minutes
          </CTAButton>
          <a
            href="#evidence"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            See the evidence ↓
          </a>
        </div>
      </section>

      {/* Comparables */}
      <section id="evidence" className="border-t border-border/60 bg-secondary/40">
        <div className="container mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-serif text-2xl text-primary sm:text-3xl">
            What we compared your home to
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Three comparable Kankakee homes in {o.township} Township
          </p>

          <div className="mt-8 overflow-hidden rounded-md border border-border bg-card">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Site address</th>
                  <th className="px-4 py-3">Assessed value</th>
                  <th className="px-4 py-3">Distance</th>
                  <th className="px-4 py-3">Lot size</th>
                </tr>
              </thead>
              <tbody>
                {o.comparables.map((c) => (
                  <tr key={c.siteAddress} className="border-t border-border">
                    <td className="px-4 py-3 text-foreground">{c.siteAddress}</td>
                    <td className="px-4 py-3 text-foreground">{fmt(c.assessedValue)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.distanceMiles} mi
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.lotSizeAcres} ac
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-border bg-secondary/30">
                  <td className="px-4 py-3 font-medium text-primary">
                    Your home — {o.siteAddress}
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">
                    {fmt(o.currentAssessedValue)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">—</td>
                  <td className="px-4 py-3 text-muted-foreground">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/90">
            These three homes are in the same township as yours and share your
            property class code. We believe your assessment sits about 15%
            higher than the median of these comparable homes.
          </p>
        </div>
      </section>

      {/* What happens if you say yes */}
      <section className="container mx-auto max-w-4xl px-6 py-16">
        <h2 className="font-serif text-2xl text-primary sm:text-3xl">
          What happens if you say yes
        </h2>
        <ol className="mt-8 space-y-6">
          {[
            "You sign a one-page authorization — about 2 minutes, e-signature.",
            "We prepare and file your Board of Review appeal before the window closes.",
            "If the Board reduces your assessment, our fee is 40% of your year-one tax savings. If they don't, you pay nothing.",
          ].map((step, i) => (
            <li key={i} className="flex gap-5">
              <span className="font-serif text-2xl text-accent">{i + 1}</span>
              <p className="pt-1 text-base leading-relaxed text-foreground/90">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* What we're NOT doing */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="container mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-serif text-2xl text-primary sm:text-3xl">
            What we're not doing
          </h2>
          <ul className="mt-6 space-y-3 text-base leading-relaxed text-foreground/90">
            <li>— We don't represent you in any other legal matter.</li>
            <li>— We don't appeal to PTAB or any court.</li>
            <li>— We don't touch your tax payments to the county.</li>
          </ul>
        </div>
      </section>

      {/* Secondary CTA + opt out */}
      <section className="container mx-auto max-w-4xl px-6 py-16">
        <CTAButton href="mailto:hello@kankakeeappeals.com?subject=Start my appeal">
          Start my appeal
        </CTAButton>
        <p className="mt-10 text-sm text-muted-foreground">
          <a
            href="mailto:hello@kankakeeappeals.com?subject=Not my property"
            className="underline-offset-4 hover:text-primary hover:underline"
          >
            This isn't my property, or I'd rather not proceed — let us know
          </a>
        </p>
      </section>

      <SiteFooter extraDisclaimer="Our assessment of your property is based on publicly available Kankakee County parcel data. It is our opinion, not a legal determination." />
    </div>
  );
};

export default Opportunity;