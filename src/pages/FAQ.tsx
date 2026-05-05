import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const faqs = [
  {
    q: "Is this legal advice?",
    a: "No. Property Tax Appeal AI LLC is not a law firm and does not provide legal advice, legal representation, or tax consulting. We provide data analysis and document preparation services only. Use of this service does not create an attorney-client relationship.",
  },
  {
    q: "Do you file the appeal for me?",
    a: "No. We prepare a Data Report and a pre-filled, editable appeal template. You are solely responsible for reviewing, editing, signing, and filing the appeal with the appropriate county office by the applicable deadline.",
  },
  {
    q: "Do you guarantee my taxes will be reduced?",
    a: "No. No outcome is guaranteed. Whether your assessment is reduced is decided by the county assessor or board of review based on the evidence and arguments you submit.",
  },
  {
    q: "How much does it cost?",
    a: "A flat $149 for the Assessment Comparison Report and editable appeal template ($199 in select high-value markets). There is no percentage of savings, no contingency fee, and no hidden charges. Optional Tax Watch monitoring is $19–$29 per year.",
  },
  {
    q: "What data do you use?",
    a: "Publicly available county assessor records, recorded property transfers, and public property characteristic data. We do not use proprietary or non-public sources, and we do not independently verify the underlying government data.",
  },
  {
    q: "How do you choose the comparable properties?",
    a: "We use regression analysis on public assessment and sales data, evaluating square footage, lot size, year built, bedroom and bathroom count, property class, and geographic proximity to identify 5–10 statistically similar properties.",
  },
  {
    q: "Where do you operate?",
    a: "We are launching in Cook County and the Illinois collar counties (DuPage, Lake, Will, Kane, McHenry) in June 2026, with Midwest expansion to follow.",
  },
  {
    q: "What if my data doesn't suggest an issue?",
    a: "Before you pay, you'll see a preview of the comparison. If the data doesn't suggest your assessment is out of line with comparable properties, you don't pay.",
  },
];

const FAQ = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="FAQ"
      description="Answers to common questions about Property Tax Appeal AI — pricing, what we do and don't do, data sources, and where we operate."
      path="/faq"
    />
    <SiteHeader />
    <main>
      <section className="container mx-auto max-w-3xl px-6 pt-16 pb-6 sm:pt-24">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">FAQ</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-primary sm:text-5xl">
          Questions, plainly answered.
        </h1>
      </section>
      <section className="container mx-auto max-w-3xl px-6 py-10">
        <dl className="space-y-10">
          {faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-serif text-xl text-primary sm:text-2xl">{f.q}</dt>
              <dd className="mt-3 text-base leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default FAQ;