import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PinHelper } from "@/components/PinHelper";
import { normalizePin } from "@/lib/pin";
import { api, ApiError } from "@/lib/api";
import { saveLookup } from "@/lib/lookupCache";
import {
  MapPin,
  FileText,
  Receipt,
  ArrowRight,
  CheckCircle2,
  Search,
} from "lucide-react";

const counties = ["Cook", "DuPage", "Lake", "Will", "Kane", "McHenry"];

const problems = [
  {
    h: "Assessments don't always match the market.",
    p: "Two homes on the same block can be assessed very differently. Most owners never check, because pulling the comparable data is tedious.",
  },
  {
    h: "The appeal forms are public — the work is the gathering.",
    p: "Counties publish the forms and the data. The friction is finding comparable properties, organizing the numbers, and filling in the right fields.",
  },
  {
    h: "Contingency firms take a cut of your savings.",
    p: "Many appeal firms charge a percentage of your year-one savings. We don't. We're a flat-fee document preparation service — you keep 100% of any reduction.",
  },
];

const steps = [
  {
    h: "Enter your address.",
    p: "We look up your Property Index Number (PIN) and pull your current assessed value from public county records.",
  },
  {
    h: "Get your comparison report.",
    p: "We use regression analysis on public assessment and sales data to identify comparable properties, then organize the numbers into a clear side-by-side report. Preview key findings before paying.",
  },
  {
    h: "Review, edit, and file yourself.",
    p: "Download the full report and a pre-filled, editable appeal template for your jurisdiction. You review the data, edit anything you want to change, and file it with your local board of review. We do not file on your behalf.",
  },
];

const tiers = [
  {
    name: "Assessment Comparison Report + Appeal Template",
    price: "$149",
    suffix: "flat fee · one-time",
    body: "Comparable property data report, pre-filled editable appeal template, and jurisdiction-specific filing instructions. No percentage of savings, no hidden costs.",
    popular: true,
  },
  {
    name: "Annual Tax Watch",
    price: "$19–$29",
    suffix: "per year",
    body: "Annual monitoring of your assessed value, automated alerts when a new assessment is published, and a year-over-year comparison report.",
  },
];

const faqs = [
  "Is this legal advice?",
  "Do you file the appeal for me?",
  "How do you find comparable properties?",
  "Do you guarantee my taxes will be reduced?",
];

const Index = () => {
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        if (err.status === 404) setError("We couldn't find that PIN. Double-check the format and try again.");
        else if (err.status === 422) setError(err.body?.hint ?? "No structural characteristics on file for this PIN.");
        else if (err.status === 400) setError("Please enter a valid PIN.");
        else setError("Something went wrong. Please try again.");
      } else {
        setError("Network error. Please try again.");
      }
      setSubmitting(false);
    }
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Property Tax Appeal AI LLC",
    url: "https://propertytaxappealai.com",
    logo: "https://propertytaxappealai.com/favicon.ico",
    description:
      "Data analysis and document preparation service for residential property tax assessments. Not a law firm. Launching in Illinois in June 2026.",
    areaServed: counties.map((c) => ({
      "@type": "AdministrativeArea",
      name: `${c} County, Illinois`,
    })),
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@propertytaxappealai.com",
      contactType: "customer support",
      areaServed: "US-IL",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Property Tax Appeal AI",
    url: "https://propertytaxappealai.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://propertytaxappealai.com/?address={address}",
      "query-input": "required name=address",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this legal advice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Property Tax Appeal AI LLC is a data analysis and document preparation service. We organize publicly available property data into reports and provide editable appeal templates. We do not interpret the law, recommend legal strategies, or predict outcomes. If you need legal advice, please consult a licensed attorney in your jurisdiction.",
        },
      },
      {
        "@type": "Question",
        name: "Do you file the appeal for me?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. We provide a pre-filled, editable appeal template and step-by-step filing instructions. You are responsible for reviewing the template, making any changes, and filing it with the appropriate board of review. We do not submit, e-file, or transmit any documents on your behalf.",
        },
      },
      {
        "@type": "Question",
        name: "Do you guarantee my taxes will be reduced?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. We provide data analysis and document preparation. Whether your appeal succeeds depends on many factors, including the strength of comparable evidence and the decisions of the reviewing body. We cannot guarantee any outcome.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Property Tax Appeal AI — Compare Your Assessment to Comparable Homes"
        description="Compare your property tax assessment to similar homes using public county records. Comparison report plus an editable appeal template you review, edit, and file yourself. Flat $149."
        path="/"
        jsonLd={[orgJsonLd, websiteJsonLd, faqJsonLd]}
      />
      <SiteHeader />
      <main>
      {/* Hero */}
      <section aria-labelledby="hero-heading" className="container mx-auto max-w-5xl px-6 pt-16 pb-20 sm:pt-24">
        <h1 id="hero-heading" className="font-serif text-4xl leading-[1.05] text-primary sm:text-5xl md:text-6xl">
          Is your property tax assessment higher than it should be?
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Compare your home's assessed value to similar properties using public
          county records. You get a detailed comparison report and an editable
          appeal template — ready for you to review, edit, and file yourself.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="PIN (e.g. 16-19-213-035-0000)"
              aria-label="Your Property Index Number"
              className="h-14 w-full rounded-md border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 sm:text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-accent px-7 text-base font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-lg"
          >
            {submitting ? "Checking…" : "Get started"}
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <PinHelper />
        <p className="mt-3 text-sm text-muted-foreground">
          Enter your 14-digit Cook County Property Index Number. Comparison preview is free; full appeal packet is $149 flat.
        </p>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="container mx-auto max-w-5xl px-6 py-5">
          <div className="flex flex-col items-start gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary/70" />
              Built on public county records
            </div>
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary/70" />
              Flat $149 — no percentage of savings
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary/70" />
              You review, edit, and file
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="container mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {problems.map((p) => (
            <div key={p.h}>
              <h3 className="font-serif text-xl text-primary">{p.h}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {p.p}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="container mx-auto max-w-5xl px-6 py-20">
          <h2 className="font-serif text-3xl text-primary sm:text-4xl">How it works.</h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Three steps. Public data in. A report and an editable template out. You stay in control.
          </p>
          <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-3">
            {steps.map((p, i) => (
              <div key={p.h} className="flex gap-5">
                <div className="font-serif text-2xl text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-primary">{p.h}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {p.p}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample data report */}
      <section className="container mx-auto max-w-5xl px-6 py-20">
        <h2 className="font-serif text-3xl text-primary sm:text-4xl">See the data.</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Every customer receives a Data Report like this — read-only, sourced
          entirely from public county assessment and sales records.
        </p>

        {/* Stylized packet mockup */}
        <div className="mt-10 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          {/* Packet header */}
          <div className="border-b border-border bg-secondary/40 px-6 py-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Data Report — For Informational Purposes Only
            </p>
            <p className="mt-1 font-serif text-lg text-primary">
              742 Hawthorne Ln, Wheaton, IL 60187 · DuPage County
            </p>
          </div>

          {/* Comparables grid */}
          <div className="grid gap-px bg-border md:grid-cols-3">
            {[
              { dir: "0.2 mi N", sqft: 2140, year: 1998, av: 119400 },
              { dir: "0.4 mi E", sqft: 2080, year: 2001, av: 121800 },
              { dir: "0.3 mi W", sqft: 2210, year: 1996, av: 123500 },
            ].map((c) => (
              <div key={c.dir} className="bg-card p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Comparable
                </p>
                <p className="mt-1 font-medium text-primary">{c.dir}</p>
                <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between"><dt>Sq ft</dt><dd className="text-foreground tabular-nums">{c.sqft.toLocaleString()}</dd></div>
                  <div className="flex justify-between"><dt>Year built</dt><dd className="text-foreground tabular-nums">{c.year}</dd></div>
                  <div className="flex justify-between"><dt>Assessed value</dt><dd className="text-foreground tabular-nums">${c.av.toLocaleString()}</dd></div>
                </dl>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className="flex flex-col gap-2 border-t border-border bg-secondary/30 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Comparison summary
              </p>
              <p className="mt-1 font-serif text-base text-primary">
                Subject's assessed value is{" "}
                <span className="text-accent">$18,200</span> above the median of these comparables.
              </p>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              The homeowner reviews this data and decides whether to file. No outcome is guaranteed.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="container mx-auto max-w-5xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-3xl text-primary sm:text-4xl">Pricing</h2>
            <a href="/pricing" className="text-sm font-medium text-primary hover:underline">
              See full details →
            </a>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`relative rounded-lg border bg-card p-6 ${
                  t.popular ? "border-accent shadow-md" : "border-border"
                }`}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-accent-foreground">
                    Most popular
                  </span>
                )}
                <p className="font-serif text-lg text-primary">{t.name}</p>
                <p className="mt-3">
                  <span className="font-serif text-3xl text-primary">{t.price}</span>{" "}
                  <span className="text-sm text-muted-foreground">{t.suffix}</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Standard markets: $149. High-value markets (e.g., New Jersey at launch expansion): $199.
          </p>
        </div>
      </section>

      {/* Counties served */}
      <section className="container mx-auto max-w-5xl px-6 py-20">
        <h2 className="font-serif text-3xl text-primary sm:text-4xl">Where we're launching</h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          Property Tax Appeal AI launches in Illinois in <strong className="text-foreground">June 2026</strong>,
          starting with Cook County and the collar counties. Midwest expansion to follow.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {counties.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-primary"
            >
              <CheckCircle2 className="h-4 w-4 text-accent" />
              {c} County
            </span>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Don't see your county?{" "}
          <a href="/counties" className="font-medium text-primary hover:underline">
            Join the notify list →
          </a>
        </p>
      </section>

      {/* FAQ teaser */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="container mx-auto max-w-3xl px-6 py-20">
          <h2 className="font-serif text-3xl text-primary sm:text-4xl">Common questions</h2>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {faqs.map((q) => (
              <li key={q}>
                <a
                  href="/faq"
                  className="flex items-center justify-between gap-4 py-5 text-base text-primary hover:text-accent"
                >
                  <span>{q}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/faq"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            See all questions →
          </a>
        </div>
      </section>

      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
