import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="container mx-auto max-w-3xl px-6 py-10">
    <h2 className="font-serif text-2xl text-primary sm:text-3xl">{title}</h2>
    <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">{children}</div>
  </section>
);

const Methodology = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Methodology"
      description="How we identify comparable properties, generate Data Reports, and pre-fill appeal templates — using regression analysis on public county records."
      path="/methodology"
    />
    <SiteHeader />
    <main>
      <section className="container mx-auto max-w-3xl px-6 pt-16 pb-6 sm:pt-24">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">Methodology</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-primary sm:text-5xl">
          How the numbers are produced.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          We do specific, describable things — not magic. Every step below uses
          publicly available records and standard statistical methods.
        </p>
      </section>

      <Section title="1. PIN entry">
        <p>
          You enter your Property Index Number (PIN) — the canonical key your county uses
          to identify your parcel. It's printed on your most recent property tax bill or
          assessment notice, and you can also look it up on your county assessor's site.
          We use the PIN directly because address-to-PIN matching is not reliable enough
          to drive an assessment comparison.
        </p>
      </Section>

      <Section title="2. Property data retrieval">
        <p>
          Using the PIN, we retrieve your property's current assessed value, land value,
          improvement value, property class, square footage, lot size, year built, and
          recorded bedroom and bathroom counts — all from the county assessor's public
          database.
        </p>
      </Section>

      <Section title="3. Comparable identification (regression analysis)">
        <p>
          We run regression analysis on publicly available assessment and sales data to
          identify properties most statistically similar to yours. The model evaluates
          square footage, lot size, year built, bedroom and bathroom count, property
          class, and geographic proximity. The output is a set of 5–10 comparable
          properties within the same township or assessment neighborhood.
        </p>
        <p>
          We present the comparables and the underlying data. We do not select which
          comparables you should emphasize or argue from — that's your decision.
        </p>
      </Section>

      <Section title="4. Data Report generation">
        <p>
          The Data Report summarizes the subject property's assessed value and characteristics,
          the comparable properties' values and characteristics, assessment-to-sale ratios,
          per-square-foot comparisons, and an equity analysis against the neighborhood median.
          It is delivered as a read-only PDF labeled "FOR INFORMATIONAL PURPOSES ONLY."
        </p>
      </Section>

      <Section title="5. Editable template population">
        <p>
          The appeal template is jurisdiction-specific. For Cook County, it maps to the
          Cook County Board of Review complaint form. We pre-fill only factual, publicly
          available fields: PIN, address, owner name (from public records), current
          assessed value, and a system-calculated requested value derived from the
          comparable analysis.
        </p>
        <p>
          Every other field is left blank for you to complete. The template is labeled
          "DRAFT TEMPLATE — HOMEOWNER MUST REVIEW, EDIT, AND FILE."
        </p>
      </Section>

      <Section title="6. What the system does not do">
        <p>
          We do not interpret statutes or case law. We do not predict the outcome of your
          appeal. We do not select the "best" comparables for argument. We do not draft
          narrative legal arguments. We do not file documents on your behalf. We do not
          represent you before any board of review or tribunal.
        </p>
      </Section>

      <Section title="Data sources">
        <p>
          All data is derived from publicly available government records: county assessor
          databases, recorded property transfers, and public property characteristic records.
          We do not use proprietary or non-public data sources. We do not independently
          verify the accuracy of the underlying government data.
        </p>
      </Section>
    </main>
    <SiteFooter />
  </div>
);

export default Methodology;