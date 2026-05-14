import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="container mx-auto max-w-4xl px-8 md:px-12 lg:px-24 py-12">
    <h2 className="type-h3 text-primary">{title}</h2>
    <div className="mt-6 space-y-6 type-body-lg text-slate leading-relaxed">
      {children}
    </div>
  </section>
);

const Methodology = () => (
  <div className="flex min-h-screen flex-col bg-background text-foreground">
    <SEO
      title="Methodology — TaxAppeal.app"
      description="How we identify comparable properties, generate Data Reports, and pre-fill appeal templates — using regression analysis on public county records."
      path="/methodology"
    />
    <SiteHeader />
    <main className="flex-1">
      <header className="container mx-auto max-w-4xl px-8 md:px-12 lg:px-24 pt-16 pb-10 sm:pt-24">
        <p className="type-eyebrow-lg">Science, not magic</p>
        <h1 className="mt-4 type-h1 text-primary">
          How the numbers are produced.
        </h1>
        <p className="mt-8 type-body-lg text-slate max-w-2xl">
          We organize publicly available property records into a clear comparison and a pre-filled
          appeal template using standard statistical methods.
        </p>
      </header>

      <div className="divide-y divide-border/40">
        <Section title="1. Address entry">
          <p>
            You enter your property address or PIN. We map your address to your Property Index 
            Number (PIN) — the canonical key your county uses to identify your parcel.
            We use the PIN directly because it is the most reliable way to drive a high-trust 
            assessment comparison across government databases.
          </p>
        </Section>

        <Section title="2. Property data retrieval">
          <p>
            Using the PIN, we retrieve your property's current assessed value, land value,
            improvement value, property class, square footage, lot size, year built, and
            recorded bedroom and bathroom counts — all directly from the county assessor's 
            public database.
          </p>
        </Section>

        <Section title="3. Comparable identification">
          <p>
            We run regression analysis on public assessment data to identify properties most 
            statistically similar to yours. The model evaluates square footage, lot size, 
            year built, property class, and geographic proximity.
          </p>
          <p>
            We present the comparables and the underlying data side-by-side. We do not select 
            which comparables you should emphasize — that remains your decision.
          </p>
        </Section>

        <Section title="4. Data Report generation">
          <p>
            The Data Report summarizes the subject property's characteristics against the 
            comparable median and assessment-to-sale ratios. It is delivered as a read-only 
            PDF labeled "FOR INFORMATIONAL PURPOSES ONLY." You don't file this with anyone; 
            it serves as your evidentiary foundation.
          </p>
        </Section>

        <Section title="5. Editable template population">
          <p>
            The appeal template is jurisdiction-specific. We pre-fill only factual, publicly 
            available fields: PIN, address, owner name, and current assessed value.
          </p>
          <p>
            Every other field is left blank for you to complete. The template is labeled 
            "HOMEOWNER MUST REVIEW, EDIT, AND FILE" to ensure you maintain full control 
            over your submission.
          </p>
        </Section>

        <Section title="6. What the system does not do">
          <p>
            We do not interpret statutes or case law. We do not predict the outcome of your 
            appeal. We do not draft narrative legal arguments. We do not file documents on 
            your behalf. We do not represent you before any board of review or tribunal.
          </p>
        </Section>

        <Section title="Data sources">
          <p>
            All data is derived from publicly available government records. We do not use 
            proprietary or non-public data sources. We do not independently verify the 
            accuracy of the underlying government data.
          </p>
        </Section>
      </div>
    </main>
    <SiteFooter />
  </div>
);

export default Methodology;