import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Check, ArrowRight } from "lucide-react";

const corePackage = [
  "Direct PIN entry — pulls your assessment from public county records",
  "Comparable-property Data Report (read-only PDF)",
  "Pre-filled, editable appeal template for your jurisdiction",
  "Step-by-step filing instructions",
  "Cook County: covers Assessor's Office and Board of Review forms",
];

const taxWatch = [
  "Annual monitoring of your assessed value",
  "Email alert when a new assessment is published",
  "Year-over-year comparison report",
  "Data-based notification if your new assessment appears higher than comparable properties",
];

const Pricing = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Pricing"
      description="Flat $149 for the assessment comparison report and editable appeal template. No percentage of savings, no hidden fees. Optional $19–$29/year Tax Watch monitoring."
      path="/pricing"
    />
    <SiteHeader />
    <main>
      <section className="container mx-auto max-w-4xl px-6 pt-16 pb-10 sm:pt-24">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">Pricing</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-primary sm:text-5xl">
          One flat fee. No percentage of your savings.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Many appeal firms charge a percentage of your year-one tax savings.
          We don't. You pay once for the report and the editable template — and
          you keep 100% of any reduction.
        </p>
      </section>

      <section className="container mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative rounded-lg border-2 border-accent bg-card p-7 shadow-sm">
            <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-accent-foreground">
              Core package
            </span>
            <p className="font-serif text-xl text-primary">
              Assessment Comparison Report + Appeal Template
            </p>
            <p className="mt-4">
              <span className="font-serif text-4xl text-primary">$149</span>{" "}
              <span className="text-sm text-muted-foreground">flat fee · one-time</span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              $199 in high-value markets (e.g., New Jersey at expansion).
            </p>
            <ul className="mt-6 space-y-3 text-sm text-foreground/90">
              {corePackage.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/"
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground hover:bg-accent-hover"
            >
              Enter your PIN <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-card p-7">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Add-on
            </p>
            <p className="mt-1 font-serif text-xl text-primary">Annual Tax Watch</p>
            <p className="mt-4">
              <span className="font-serif text-4xl text-primary">$19–$29</span>{" "}
              <span className="text-sm text-muted-foreground">per year</span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Priced by market.</p>
            <ul className="mt-6 space-y-3 text-sm text-foreground/90">
              {taxWatch.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-secondary/40">
        <div className="container mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-serif text-2xl text-primary sm:text-3xl">What you will not see on your bill</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "No percentage of your tax savings",
              "No contingency fee",
              "No success fee",
              "No subscription required to use the core package",
              "No charge if you don't proceed past the free preview",
              "No upsell to legal services",
            ].map((line) => (
              <p key={line} className="text-sm text-foreground/80">— {line}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-serif text-xl text-primary">Complex case? Commercial or multi-parcel?</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Our service is built for standard residential appeals. If your situation involves
          commercial property, multi-parcel portfolios, or circumstances that genuinely require
          attorney representation, we can refer you to an independent law firm in your jurisdiction
          that handles property tax appeals. The law firm operates separately from us.
        </p>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default Pricing;