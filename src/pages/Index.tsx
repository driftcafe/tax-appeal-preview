import { useState } from "react";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PropertySearch } from "@/components/PropertySearch";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { UniformityHeatmap } from "@/components/UniformityHeatmap";
import { WaitlistModal } from "@/components/WaitlistModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight, Check, Home, BarChart3, FileText, ShieldCheck, Zap, Sparkles,
} from "lucide-react";

const trustBullets = [
  "No legal knowledge required",
  "County-ready editable forms",
  "Flat fee, no contingency cut",
  "Built for Illinois homeowners",
];

const steps = [
  {
    icon: Home,
    h: "Enter your address or PIN.",
    p: "We pull your assessor record instantly and identify comparable homes in your township.",
    deliverables: [] as string[],
  },
  {
    icon: BarChart3,
    h: "See your Fairness Score.",
    p: "We compare your assessed value per sq ft against your neighbors. You'll see exactly how much higher you're paying — and why it qualifies for appeal.",
    deliverables: [] as string[],
  },
  {
    icon: FileText,
    h: "Download your Editable Appeal Package.",
    p: "Everything pre-filled, county-ready, and organized. File it yourself in minutes — no lawyer needed.",
    deliverables: ["Pre-filled appeal forms", "County-specific filing instructions", "Comparable home evidence"],
  },
];

const tiers = [
  {
    name: "Free — Fairness Check",
    price: "$0",
    suffix: "",
    body: "Address lookup, Fairness Score, estimated overpayment, and a top-line comp summary.",
    cta: "Get my free score",
    href: "#hero",
  },
  {
    name: "Pro Se Toolkit",
    price: "$149",
    suffix: "one-time",
    body: "Full comp data, pre-filled editable appeal forms, county-specific filing instructions, downloadable packet, and email support.",
    cta: "Start my appeal",
    href: "#hero",
    popular: true,
  },
  {
    name: "AI Premium Review",
    price: "$399",
    suffix: "one-time",
    body: "Comp quality scoring, Appeal Strength Score, risk flag analysis, AI-generated summary, and a polished branded report (20–40 pages).",
    cta: "Join the waitlist",
    waitlist: "premium" as const,
  },
];

const faqs = [
  { q: "Is this legal advice?", a: "No. TaxAppeal.app prepares data and documents for homeowners filing pro se. We do not provide legal advice or representation." },
  { q: "Do you guarantee my taxes will go down?", a: "No. Outcomes depend on county review, evidence quality, and local rules. We provide data, analysis, and organized documents to support your filing." },
  { q: "What does \"lack of uniformity\" mean?", a: "Your home may be assessed more aggressively than similar nearby homes. Illinois law allows appeals based on this." },
  { q: "Will the county punish me for appealing?", a: "No. Appeals are a routine, lawful process used by thousands of Illinois homeowners every year." },
  { q: "What if I miss the deadline?", a: "You'd have to wait until next year. Tax Watch sends township-specific reminders so you don't miss it." },
  { q: "What's the difference between $149 and $399?", a: "The $149 toolkit gives you everything you need to file. The $399 tier adds AI-driven analysis, comp quality ranking, risk flags, and a polished report — recommended if you want extra confidence before submitting." },
  { q: "Can I get a refund?", a: "Yes, within 7 days if you haven't downloaded your packet." },
];

const Index = () => {
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [taxWatchOpen, setTaxWatchOpen] = useState(false);

  const orgJsonLd = {
    "@context": "https://schema.org", "@type": "Organization",
    name: "TaxAppeal.app", url: "https://taxappeal.app",
    description: "Flat-fee property tax appeal toolkit for Illinois homeowners. Compare your assessment to similar homes and file a county-ready appeal yourself.",
  };
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="TaxAppeal.app — Find out if your home is assessed unfairly"
        description="Free Fairness Score for any property in Cook County and the collar counties. If you're overpaying, keep 100% of the savings — not 35% to a law firm."
        path="/"
        jsonLd={[orgJsonLd, faqJsonLd]}
      />
      <SiteHeader />
      <main>
        {/* HERO */}
        <section id="hero" aria-labelledby="hero-heading" className="relative overflow-hidden bg-navy">
          {/* Subtle grid texture overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--navy-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--navy-foreground)) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="container relative mx-auto max-w-5xl px-6 pt-16 pb-20 sm:pt-28 sm:pb-24">
            {/* Eyebrow */}
            <p className="animate-fade-up text-xs font-semibold uppercase tracking-widest text-success [animation-delay:0ms]">
              Free &middot; No account required &middot; Illinois homeowners
            </p>

            <h1
              id="hero-heading"
              className="animate-fade-up mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[3.75rem] [animation-delay:80ms]"
            >
              Your home may be assessed unfairly.
              <br className="hidden sm:block" />
              <span className="text-success">Find out in 60 seconds.</span>
            </h1>

            <p className="animate-fade-up mt-5 max-w-2xl text-lg leading-relaxed text-navy-muted sm:text-xl [animation-delay:160ms]">
              Get your free Fairness Score for any property in Cook County or the collar counties.
              Keep 100% of your savings&nbsp;&mdash; not 35% to a law firm.
            </p>

            {/* Address bar */}
            <div className="animate-fade-up mt-8 [animation-delay:240ms]">
              <PropertySearch variant="hero" />
            </div>

            {/* Savings badge */}
            <div className="animate-fade-up mt-5 [animation-delay:320ms]">
              <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
                <span className="inline-block h-2 w-2 animate-pulse-green rounded-full bg-success" />
                Avg. homeowner keeps{" "}
                <span className="font-bold tabular-nums text-white">$3,701</span>
                {" "}&mdash; flat $149 vs. 35% contingency fee
              </span>
            </div>

            {/* Trust strip */}
            <ul className="animate-fade-up mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-navy-muted [animation-delay:400ms]">
              {trustBullets.map((b) => (
                <li key={b} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-success" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CALCULATOR */}
        <section className="border-t border-border/60 bg-secondary/30">
          <div className="container mx-auto max-w-5xl px-6 py-20">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Keep your savings</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              The contingency-firm math, in one place.
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              Most appeal firms take 35–40% of your year-one savings. We charge a flat $149.
              Move the slider to your situation.
            </p>
            <div className="mt-8">
              <SavingsCalculator />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="container mx-auto max-w-5xl px-6 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-electric">Simple process</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">Three steps to a lower tax bill.</h2>

          <div className="mt-12 grid gap-0 md:grid-cols-3">
            {steps.map((s, i) => {
              const isLast = i === steps.length - 1;
              return (
                <div key={s.h} className="relative">
                  {/* Connector line between steps (desktop) */}
                  {!isLast && (
                    <div className="absolute left-[calc(50%+24px)] top-5 hidden h-px w-[calc(100%-48px)] border-t-2 border-dashed border-electric/25 md:block" />
                  )}

                  <div className={`flex flex-col rounded-2xl border p-6 h-full ${
                    isLast
                      ? "border-2 border-success bg-success/5 shadow-md"
                      : "border-border bg-card"
                  }`}>
                    {/* Step circle */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-electric text-electric-foreground text-sm font-bold shadow-sm">
                        {i + 1}
                      </div>
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                        <s.icon className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-electric">Step {i + 1}</p>
                    <h3 className={`mt-1 text-lg font-semibold text-primary leading-tight ${
                      isLast ? "text-xl" : ""
                    }`}>{s.h}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.p}</p>

                    {/* Deliverables list (Step 3 only) */}
                    {s.deliverables.length > 0 && (
                      <>
                        <ul className="mt-4 space-y-1.5">
                          {s.deliverables.map((d) => (
                            <li key={d} className="inline-flex items-center gap-2 text-sm font-medium text-foreground/90">
                              <Check className="h-4 w-4 flex-shrink-0 text-success" />
                              {d}
                            </li>
                          ))}
                        </ul>
                        <a
                          href="#hero"
                          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-electric px-5 text-sm font-semibold text-electric-foreground hover:bg-electric-hover transition-colors"
                        >
                          Start my appeal &mdash; $149 <ArrowRight className="h-4 w-4" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* UNIFORMITY */}
        <section className="border-t border-border/60 bg-secondary/30">
          <div className="container mx-auto max-w-5xl px-6 py-20">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-accent">The Uniformity Score, explained</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  Why the gap between you and your neighbors matters.
                </h2>
                <ul className="mt-6 space-y-3 text-base text-foreground/90">
                  <li className="flex gap-3"><Check className="mt-1 h-5 w-5 flex-shrink-0 text-success" /> Illinois law allows property tax appeals based on assessment uniformity.</li>
                  <li className="flex gap-3"><Check className="mt-1 h-5 w-5 flex-shrink-0 text-success" /> Your home shouldn't be assessed higher than similar nearby homes.</li>
                  <li className="flex gap-3"><Check className="mt-1 h-5 w-5 flex-shrink-0 text-success" /> We surface that gap with hard data — sqft, lot size, age, and assessed value per square foot.</li>
                </ul>
              </div>
              <UniformityHeatmap />
            </div>
          </div>
        </section>

        {/* WINNETKA EXAMPLE */}
        <section className="container mx-auto max-w-4xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Real-world example</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">Winnetka single-family home</h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
            <dl className="divide-y divide-border">
              <ExRow label="Original assessment" value="$1,420,000" />
              <ExRow label="Comparable homes supported" value="$1,190,000" />
              <ExRow label="Estimated annual reduction" value="$3,850" />
              <ExRow label="Contingency law firm fee (35%)" value="−$1,347" negative />
              <ExRow label="TaxAppeal.app flat fee" value="−$149" negative />
              <div className="flex items-baseline justify-between gap-4 bg-secondary/40 px-6 py-6">
                <dt className="text-base font-semibold text-primary">Homeowner kept</dt>
                <dd className="text-3xl font-bold tabular-nums sm:text-4xl" style={{ color: "hsl(var(--accent-hover))" }}>$3,701</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* PRICING */}
        <section className="border-t border-border/60 bg-secondary/30">
          <div className="container mx-auto max-w-6xl px-6 py-20">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Pricing</h2>
                <p className="mt-2 text-base text-muted-foreground">Three ways to use TaxAppeal.app. No subscriptions required.</p>
              </div>
              <a href="/pricing" className="text-sm font-medium text-primary hover:underline">See full details →</a>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {tiers.map((t) => (
                <div
                  key={t.name}
                  className={`relative flex flex-col rounded-2xl border bg-card p-6 ${t.popular ? "border-2 border-accent shadow-lg md:scale-[1.02]" : "border-border"}`}
                >
                  {t.popular && (
                    <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                      Most popular
                    </span>
                  )}
                  <p className="text-sm font-semibold text-primary">{t.name}</p>
                  <p className="mt-3">
                    <span className="text-4xl font-bold tracking-tight text-primary">{t.price}</span>{" "}
                    {t.suffix && <span className="text-sm text-muted-foreground">{t.suffix}</span>}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                  {t.waitlist ? (
                    <button
                      onClick={() => setPremiumOpen(true)}
                      className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-primary bg-background px-5 text-sm font-medium text-primary hover:bg-secondary/60"
                    >
                      <Sparkles className="h-4 w-4" /> {t.cta}
                    </button>
                  ) : (
                    <a
                      href={t.href}
                      className={`mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold ${t.popular ? "bg-electric text-electric-foreground hover:bg-electric-hover" : "bg-primary text-primary-foreground hover:opacity-90"}`}
                    >
                      {t.cta} <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Tax Watch */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">Tax Watch — $29/year</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    We monitor your assessment every reassessment cycle, send township deadline reminders,
                    and re-run your Fairness Score automatically. Alerts when comparable homes are reassessed lower.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTaxWatchOpen(true)}
                className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-primary bg-background px-5 text-sm font-medium text-primary hover:bg-secondary/60 sm:mt-0 sm:flex-shrink-0"
              >
                <Zap className="h-4 w-4" /> Add Tax Watch
              </button>
            </div>
          </div>
        </section>

        {/* COVERAGE */}
        <section className="container mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Where we operate</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Available now</p>
              <p className="mt-2 text-lg font-semibold text-primary">Illinois</p>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-foreground/90">
                {[
                  { name: "Cook", url: "https://www.cookcountyassessoril.gov/" },
                  { name: "DuPage", url: "https://propertylookup.dupagecounty.gov/forms/htmlframe.aspx?mode=content/home.htm" },
                  { name: "Lake", url: "https://tax.lakecountyil.gov/search/commonsearch.aspx?mode=realprop" },
                  { name: "Will", url: "https://willcountysoa.com/" },
                  { name: "Kane", url: "https://treasurer.kanecountyil.gov/" },
                  { name: "McHenry", url: "https://mchenryil.devnetwedge.com/" },
                  { name: "Select downstate", url: "/counties" },
                ].map((c) => (
                  <li key={c.name} className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-success" />
                    <a
                      href={c.url}
                      target={c.url.startsWith("http") ? "_blank" : undefined}
                      rel={c.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="hover:text-primary hover:underline"
                    >
                      {c.name} County
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Coming 2027</p>
              <p className="mt-2 text-lg font-semibold text-primary">Three new states</p>
              <ul className="mt-4 grid grid-cols-3 gap-2 text-sm text-foreground/90">
                {["Georgia", "Texas", "Florida"].map((s) => (
                  <li key={s} className="rounded-md border border-border bg-card px-3 py-2 text-center">{s}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Don't see your county? <a href="/counties" className="text-primary hover:underline">Join the notify list →</a>
              </p>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="border-t border-border/60 bg-secondary/30">
          <div className="container mx-auto max-w-5xl px-6 py-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-accent">Built on public data</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">Trusted by Illinois homeowners.</h2>
              </div>
              <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                <span className="font-semibold tabular-nums text-primary">1,247</span> homes checked this week
              </div>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                { q: "Saved us $2,840 the first year. Took maybe 30 minutes total.", a: "K. Patel — Skokie, IL" },
                { q: "I almost called a law firm — glad I didn't. Same outcome, paid $149 instead of a third of my savings.", a: "M. Whelan — Oak Park, IL" },
                { q: "The Fairness Score showed exactly why our neighbors paid less. Made the appeal a no-brainer.", a: "R. Diaz — Elmhurst, IL" },
              ].map((t) => (
                <figure key={t.a} className="rounded-2xl border border-border bg-card p-5">
                  <blockquote className="text-sm leading-relaxed text-foreground/90">"{t.q}"</blockquote>
                  <figcaption className="mt-3 text-xs text-muted-foreground">{t.a}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Common questions</h2>
          <Accordion type="single" collapsible className="mt-8 divide-y divide-border border-y border-border">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-0">
                <AccordionTrigger className="text-left text-base font-medium text-primary">{f.q}</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-10 rounded-2xl border-2 border-electric/40 bg-card p-6 text-center">
            <p className="text-lg font-semibold text-primary">Ready to see your Fairness Score?</p>
            <p className="mt-1 text-sm text-muted-foreground">Free. Takes 60 seconds.</p>
            <a href="#hero" className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-electric px-6 text-base font-semibold text-electric-foreground hover:bg-electric-hover transition-colors">
              Check my property <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />

      <WaitlistModal open={premiumOpen} onOpenChange={setPremiumOpen} tier="premium" />
      <WaitlistModal open={taxWatchOpen} onOpenChange={setTaxWatchOpen} tier="tax_watch" />
    </div>
  );
};

const ExRow = ({ label, value, negative }: { label: string; value: string; negative?: boolean }) => (
  <div className="flex items-baseline justify-between gap-4 px-6 py-4">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className={`text-base tabular-nums ${negative ? "text-destructive" : "text-foreground"}`}>{value}</dd>
  </div>
);

export default Index;
