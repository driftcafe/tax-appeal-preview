import { useState } from "react";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PropertySearch } from "@/components/PropertySearch";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { UniformityComparison } from "@/components/UniformityComparison";
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
          {/* Soft radial gradient + Grid texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a365d] via-navy to-navy opacity-80" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--navy-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--navy-foreground)) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div className="container relative mx-auto flex max-w-5xl flex-col items-center pt-24 pb-28 text-center sm:pt-36 sm:pb-32">

            <h1
              id="hero-heading"
              className="animate-fade-up mt-4 type-h1 [animation-delay:80ms]"
            >
              Your property tax may be wrong.
              <br className="hidden sm:block" />
              <span className="text-success">Check it free.</span>
            </h1>

            <p className="animate-fade-up mt-5 max-w-2xl text-lg leading-relaxed text-navy-muted sm:text-xl [animation-delay:160ms]">The average homeowner saves $3,701 — and keeps all of it.
            </p>

            {/* Address bar */}
            <div className="animate-fade-up mt-10 w-full [animation-delay:240ms]">
              <PropertySearch variant="hero" />
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
        <section className="border-t border-border/60 bg-[#F7F9FB]">
          <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-20 py-24">
            <p className="type-eyebrow-lg">Keep your Savings</p>
            <h2 className="type-h2 mt-4">
              The contingency-firm math, in one place.
            </h2>
            <p className="type-body-lg mt-6 max-w-3xl">
              Most appeal firms take 35–40% of your year-one savings. <span className="type-body-lg-emph">We charge a flat $149.</span>
            </p>
            <div className="mt-8">
              <SavingsCalculator />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (TRUST ARCHITECTURE) */}
        <section className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-20 py-32">
          <div className="text-center">
            <p className="type-eyebrow-lg">How it Works</p>
            <h2 className="type-h2 mt-4">
              Data-backed appeals. Zero legal fees.
            </h2>
            <p className="type-body-lg mx-auto mt-6 max-w-3xl">
              Our engine analyzes millions of county records to build <span className="type-body-lg-emph">an airtight case for your home</span> in three simple steps.
            </p>
          </div>

          <div className="mt-12 grid gap-[30px] md:grid-cols-3">
            {steps.map((s, i) => {
              const isLast = i === steps.length - 1;
              return (
                <div key={s.h} className="relative">

                  <div className={`flex flex-col rounded-[30px] border p-8 h-full transition-all duration-300 hover:shadow-lg ${isLast
                    ? "border-success bg-success/[0.03] shadow-md ring-1 ring-success/10"
                    : "border-border/60 bg-card shadow-sm hover:border-border"
                    }`}>
                    {/* Step circle */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[18px] bg-electric/10 text-electric text-lg font-extrabold shadow-sm">
                        {i + 1}
                      </div>
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[18px] bg-secondary text-primary">
                        <s.icon className="h-6 w-6" />
                      </div>
                    </div>

                    <p className="mt-6 type-eyebrow-sm">Phase {i + 1}</p>
                    <h3 className="mt-2 type-body-lg-emph">{s.h}</h3>
                    <p className="type-body-lg mt-3 flex-1">{s.p}</p>

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

        <section className="border-t border-border/60 bg-[#F7F9FB]">
          <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-20 py-24">
            <div className="grid gap-16 md:grid-cols-2 md:items-center">
              <div>
                <p className="type-eyebrow-lg">The Uniformity Score, explained</p>
                <h2 className="type-h2 mt-4">
                  Why the gap between you and your neighbors matters.
                </h2>
                <ul className="type-body-lg mt-8 space-y-4">
                  <li className="flex gap-3"><Check className="mt-1 h-5 w-5 flex-shrink-0 text-success" /> Illinois law allows property tax appeals based on assessment uniformity.</li>
                  <li className="flex gap-3"><Check className="mt-1 h-5 w-5 flex-shrink-0 text-success" /> Your home shouldn't be assessed higher than similar nearby homes.</li>
                  <li className="flex gap-3"><Check className="mt-1 h-5 w-5 flex-shrink-0 text-success" /> We surface that gap with hard data (sqft, lot size, age, and assessed value per square foot).</li>
                </ul>
              </div>
              <UniformityComparison />
            </div>
          </div>
        </section>

        {/* WINNETKA EXAMPLE */}
        <section className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-20 py-24">
          <p className="type-eyebrow-lg">Real-world example</p>
          <h2 className="type-h2 mt-4">Winnetka single-family home</h2>
          <div className="mt-8 overflow-hidden rounded-[30px] border border-border bg-card">
            <dl className="divide-y divide-border">
              <ExRow label="Original assessment" value="$1,420,000" />
              <ExRow label="Comparable homes supported" value="$1,190,000" />
              <ExRow label="Estimated annual reduction" value="$3,850" />
              <ExRow label="Contingency law firm fee (35%)" value="−$1,347" />
              <ExRow label="TaxAppeal.app flat fee" value="−$149" />
              <div className="flex items-center justify-between gap-4 bg-secondary/40 px-6 py-6">
                <dt className="type-body-sm">Homeowner kept</dt>
                <dd className="type-h4 tabular-nums !text-success">$3,701</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="border-t border-border/60 bg-[#F7F9FB]">
          <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-20 py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="type-h2 mt-4">Pricing</h2>
                <p className="type-body-lg mt-6 max-w-3xl">
                  Three ways to use TaxAppeal.app.<br />
                  <span className="type-body-lg-emph">No subscriptions, no hidden fees, no contingency cuts.</span>
                </p>
              </div>
              <a href="/pricing" className="type-body-sm text-electric hover:underline underline-offset-4">See full details →</a>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {tiers.map((t) => (
                <div
                  key={t.name}
                  className={`relative flex flex-col rounded-[30px] bg-white p-8 shadow-[0_0_20px_0_rgba(29,29,31,0.08)] border transition-all duration-300 hover:shadow-xl ${t.popular ? "border-electric/40 ring-1 ring-electric/5 md:scale-[1.05] z-10" : "border-border/60"}`}
                >
                  {t.popular && (
                    <span className="absolute -top-3 left-8 rounded-full bg-electric px-4 py-1 text-[12px] font-bold uppercase tracking-widest text-white shadow-sm">
                      Most popular
                    </span>
                  )}
                  <p className="type-body-lg-emph">{t.name}</p>
                  <p className="mt-4">
                    <span className="type-h3">{t.price}</span>{" "}
                    {t.suffix && <span className="type-utility">{t.suffix}</span>}
                  </p>
                  <p className="mt-6 flex-1 type-body-lg">{t.body}</p>
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
            <div className="mt-12 rounded-[30px] border border-border/60 bg-white p-8 shadow-[0_0_20px_0_rgba(29,29,31,0.08)] sm:flex sm:items-center sm:justify-between sm:gap-8">
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[18px] bg-electric/10 text-electric shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="type-body-lg-emph">Tax Watch — $29/year</p>
                  <p className="mt-2 type-body-lg">
                    We monitor your assessment every reassessment cycle, send township deadline reminders,
                    and re-run your Fairness Score automatically. Alerts when comparable homes are reassessed lower.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTaxWatchOpen(true)}
                className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-electric bg-white px-6 text-[16px] font-bold text-electric hover:bg-electric/5 transition-colors sm:mt-0 sm:flex-shrink-0"
              >
                <Zap className="h-4 w-4" /> Add Tax Watch
              </button>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-20 py-32">
          <h2 className="type-h2 mt-4">Where we Operate</h2>
          <div className="mt-16 grid gap-[30px] md:grid-cols-2">
            <div className="rounded-[30px] bg-white p-[30px] shadow-[0_0_20px_0_rgba(29,29,31,0.08)] border border-border/60">
              <p className="type-eyebrow-sm">Available now</p>
              <p className="mt-2 type-body-lg-emph">Illinois</p>
              <ul className="mt-6 grid grid-cols-2 gap-y-3 gap-x-4">
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
            <div className="rounded-[30px] border border-dashed border-border/60 bg-[#F7F9FB] p-[30px]">
              <p className="type-eyebrow-sm">Coming 2027</p>
              <p className="mt-2 type-body-lg-emph">Three new states</p>
              <ul className="mt-6 grid grid-cols-3 gap-3 text-sm text-[#1D1D1F]">
                {["Georgia", "Texas", "Florida"].map((s) => (
                  <li key={s} className="rounded-md border border-border bg-card px-3 py-2 text-center">{s}</li>
                ))}
              </ul>
              <p className="mt-8 text-[16px] font-normal text-[#6E6E73]">
                Don't see your county? <a href="/counties" className="font-bold text-electric hover:underline underline-offset-4">Join the notify list →</a>
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 bg-[#F7F9FB]">
          <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-20 py-32">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="type-eyebrow-lg">Built on public data</p>
                <h2 className="type-h2 mt-4">Trusted by Illinois homeowners.</h2>
              </div>
              <div className="rounded-full border border-[#63C879] bg-[#FAFDFB] px-5 py-2.5 text-sm font-medium text-[#6E6E73]">
                <span className="font-bold tabular-nums text-[#1D1D1F]">1,247</span> homes checked this week
              </div>
            </div>

            <div className="mt-16 grid gap-[30px] md:grid-cols-3">
              {[
                { q: "Saved us $2,840 the first year. Took maybe 30 minutes total.", a: "K. Patel — Skokie, IL" },
                { q: "I almost called a law firm — glad I didn't. Same outcome, paid $149 instead of a third of my savings.", a: "M. Whelan — Oak Park, IL" },
                { q: "The Fairness Score showed exactly why our neighbors paid less. Made the appeal a no-brainer.", a: "R. Diaz — Elmhurst, IL" },
              ].map((t) => (
                <figure key={t.a} className="rounded-[30px] border border-border/60 bg-white p-8 shadow-[0_0_20px_0_rgba(29,29,31,0.08)]">
                  <blockquote className="type-body-lg">"{t.q}"</blockquote>
                  <figcaption className="mt-6 type-body-sm">{t.a}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-20 py-32">
          <p className="type-eyebrow-lg">FAQ</p>
          <h2 className="type-h2 mt-4 text-center sm:text-left">Common questions</h2>
          <Accordion type="single" collapsible className="mt-12 divide-y divide-border/60 border-y border-border/60">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-0">
                <AccordionTrigger className="py-6 text-left type-body-lg-emph hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="pb-6 type-body-lg">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-16 rounded-[30px] border border-electric/30 bg-white p-8 text-center shadow-[0_0_20px_0_rgba(29,29,31,0.08)]">
            <p className="type-body-lg-emph">Ready to see your Fairness Score?</p>
            <p className="mt-2 type-body-lg">Free. Takes 60 seconds.</p>
            <a href="#hero" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-electric px-8 type-body-lg-emph !text-white hover:bg-electric-hover transition-all">
              Check my property <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />

      <WaitlistModal open={premiumOpen} onOpenChange={setPremiumOpen} tier="premium" />
      <WaitlistModal open={taxWatchOpen} onOpenChange={setTaxWatchOpen} tier="tax_watch" />
    </div >
  );
};

const ExRow = ({ label, value }: { label: string; value: string }) => {
  const isNegative = value.startsWith("−") || value.startsWith("-");
  return (
    <div className="flex items-baseline justify-between gap-4 px-6 py-4">
      <dt className="type-body-sm">{label}</dt>
      <dd className={`type-body-lg-emph tabular-nums ${isNegative ? "!text-destructive" : ""}`}>{value}</dd>
    </div>
  );
};

export default Index;
