import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PinHelper } from "@/components/PinHelper";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { UniformityHeatmap } from "@/components/UniformityHeatmap";
import { WaitlistModal } from "@/components/WaitlistModal";
import { normalizePin } from "@/lib/pin";
import { api, ApiError } from "@/lib/api";
import { saveLookup } from "@/lib/lookupCache";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search, ArrowRight, Check, Home, BarChart3, FileText, ShieldCheck, Zap, Sparkles,
} from "lucide-react";

const trustBullets = [
  "No legal knowledge required",
  "County-ready editable forms",
  "Flat fee, no contingency cut",
  "Built for Illinois homeowners",
];

const steps = [
  { icon: Home, h: "Enter your PIN.", p: "We pull your assessor record and find comparable homes in your township." },
  { icon: BarChart3, h: "Get your Fairness Score.", p: "We score your assessment against your township and surface every comp that supports a lower valuation." },
  { icon: FileText, h: "Download a county-ready packet.", p: "File it yourself, online, in minutes. Pre-filled forms, step-by-step instructions." },
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
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [taxWatchOpen, setTaxWatchOpen] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    const pin = normalizePin(trimmed);
    if (!/^\d{14}$/.test(pin)) {
      setError("Enter a 14-digit Cook County PIN (with or without dashes).");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const data = await api.comparables(pin);
      saveLookup(data);
      navigate(`/comparables/${data.lookup_id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) setError("We couldn't find that PIN. Double-check and try again.");
        else if (err.status === 422) setError(err.body?.hint ?? "No structural characteristics on file for this PIN.");
        else if (err.status === 400) setError("Please enter a valid PIN.");
        else setError("Something went wrong. Please try again.");
      } else setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

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
        <section id="hero" aria-labelledby="hero-heading" className="relative overflow-hidden">
          <div className="container mx-auto max-w-5xl px-6 pt-16 pb-16 sm:pt-24">
            <h1 id="hero-heading" className="text-4xl font-bold leading-[1.05] tracking-tight text-primary sm:text-5xl md:text-6xl">
              Your home may be assessed unfairly.<br className="hidden sm:block" />
              <span className="text-accent">Find out in 60 seconds.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Get your free Fairness Score for any property in Cook County or the collar counties.
              If you're overpaying, keep 100% of the savings — not 35% to a law firm.
              The average homeowner keeps <span className="font-semibold text-primary">$3,701</span> using us instead.
            </p>

            <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Property Index Number (e.g. 16-19-213-035-0000)"
                  aria-label="Your Property Index Number"
                  className="h-14 w-full rounded-lg border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 sm:text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-lg"
              >
                {submitting ? "Checking…" : "Check my property"}
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            <PinHelper />

            {/* Trust strip */}
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {trustBullets.map((b) => (
                <li key={b} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-accent" /> {b}
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
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.h}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">Step {i + 1}</p>
                <h3 className="mt-1 text-xl font-semibold text-primary">{s.h}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{s.p}</p>
              </div>
            ))}
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
                  <li className="flex gap-3"><Check className="mt-1 h-5 w-5 flex-shrink-0 text-accent" /> Illinois law allows property tax appeals based on assessment uniformity.</li>
                  <li className="flex gap-3"><Check className="mt-1 h-5 w-5 flex-shrink-0 text-accent" /> Your home shouldn't be assessed higher than similar nearby homes.</li>
                  <li className="flex gap-3"><Check className="mt-1 h-5 w-5 flex-shrink-0 text-accent" /> We surface that gap with hard data — sqft, lot size, age, and assessed value per square foot.</li>
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
                      className={`mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold ${t.popular ? "bg-accent text-accent-foreground hover:bg-accent-hover" : "bg-primary text-primary-foreground hover:opacity-90"}`}
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
                {["Cook", "DuPage", "Lake", "Will", "Kane", "McHenry", "Select downstate"].map((c) => (
                  <li key={c} className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-accent" /> {c} County
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
          <div className="mt-10 rounded-2xl border-2 border-accent bg-card p-6 text-center">
            <p className="text-lg font-semibold text-primary">Ready to see your Fairness Score?</p>
            <p className="mt-1 text-sm text-muted-foreground">Free. Takes 60 seconds.</p>
            <a href="#hero" className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-base font-semibold text-accent-foreground hover:bg-accent-hover">
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
