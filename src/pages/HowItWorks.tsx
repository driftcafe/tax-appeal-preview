import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    n: "01",
    h: "Enter your address.",
    p: "We resolve your address to a Property Index Number (PIN) by querying your county assessor's public database, and pull your current assessed value, property characteristics, and recent sales history.",
  },
  {
    n: "02",
    h: "We identify comparable properties.",
    p: "Using regression analysis on public assessment and sales data, the system selects 5–10 properties most statistically similar to yours — by square footage, lot size, year built, bedroom/bathroom count, property class, and geographic proximity.",
  },
  {
    n: "03",
    h: "Preview the comparison.",
    p: "Before paying, you see a summary preview of the Data Report: how your assessment compares to the comparable median, key ratios, and a side-by-side snapshot. If the data doesn't suggest an issue, you don't pay.",
  },
  {
    n: "04",
    h: "Pay $149.",
    p: "Flat fee, processed securely through Stripe. No percentage of any future tax savings. No subscriptions. No upsell traps.",
  },
  {
    n: "05",
    h: "Receive your full report and editable template.",
    p: "You get the full Data Report (PDF) and a pre-filled, editable appeal template formatted for your jurisdiction — labeled \u201CDRAFT TEMPLATE — HOMEOWNER MUST REVIEW, EDIT, AND FILE.\u201D Factual fields (PIN, address, assessed value) are pre-populated. The rest is yours to complete.",
  },
  {
    n: "06",
    h: "Review, edit, and file yourself.",
    p: "Read the report. Edit the template as you see fit. Print or e-file with your local board of review using the step-by-step instructions we include. We do not file on your behalf and we do not represent you.",
  },
];

const HowItWorks = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="How It Works"
      description="Six steps from address entry to a filed appeal: comparison report, editable template, and you stay in control. Flat $149."
      path="/how-it-works"
    />
    <SiteHeader />
    <main>
      <section className="container mx-auto max-w-4xl px-6 pt-16 pb-10 sm:pt-24">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">How it works</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-primary sm:text-5xl">
          Public data in. A report and an editable template out.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          We organize publicly available property records into a clear comparison and a pre-filled
          appeal template. You stay the decision-maker, the editor, and the filer.
        </p>
      </section>

      <section className="container mx-auto max-w-4xl px-6 py-10">
        <div className="space-y-10">
          {steps.map((s) => (
            <div key={s.n} className="flex gap-6">
              <div className="font-serif text-3xl text-accent tabular-nums">{s.n}</div>
              <div>
                <h2 className="font-serif text-xl text-primary sm:text-2xl">{s.h}</h2>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{s.p}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-lg border border-border bg-secondary/40 p-6">
          <h2 className="font-serif text-xl text-primary">Two kinds of documents — never blended</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Data Report
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                Read-only PDF. Labeled \u201CFOR INFORMATIONAL PURPOSES ONLY.\u201D Shows comparable properties,
                ratios, and side-by-side comparisons. You don't file this with anyone.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Editable Template
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                Editable PDF or Word document. Labeled \u201CHOMEOWNER MUST REVIEW, EDIT, AND FILE.\u201D
                Only factual fields are pre-filled; you complete and submit it yourself.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-base font-medium text-accent-foreground hover:bg-accent-hover"
        >
          Enter your address to start <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default HowItWorks;