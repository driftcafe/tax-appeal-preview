import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  MapPin,
  Clock,
  Target,
  ArrowRight,
  CheckCircle2,
  Search,
} from "lucide-react";

const counties = ["Cook", "DuPage", "Lake", "Will", "Kane", "McHenry"];

const problems = [
  {
    h: "Most homeowners are overpaying.",
    p: "Roughly 30–60% of properties in the Chicago metro are over-assessed in any given year. Most owners never know.",
  },
  {
    h: "Filing an appeal is intimidating.",
    p: "Forms, deadlines, comparable selection, hearings — the process was built for professionals, not homeowners.",
  },
  {
    h: "Traditional firms are slow and opaque.",
    p: "Most charge 50% contingency, take days to produce evidence, and don't show their work.",
  },
];

const pillars = [
  {
    h: "Pay less, save more.",
    p: "Our flat-fee tier starts at $149 — the most affordable way to file an evidence-backed appeal. Our managed contingency is 30%, lower than the 40–50% most firms charge.",
  },
  {
    h: "Radical transparency.",
    p: "We show you exactly which comparable properties we selected, what adjustments we applied, and why we recommend a specific appeal value. Every customer gets an annotated report.",
  },
  {
    h: "Speed.",
    p: "AI-generated evidence packets are delivered in under 5 minutes from address entry. Most firms take 2–3 business days, which matters during peak filing season.",
  },
  {
    h: "Accuracy.",
    p: "Our ML-powered comparable selection achieves a sub-3% error rate predicting market values, vs. the 10%+ error rate typical of manual selection. The model is continuously retrained on real appeal outcome data.",
  },
  {
    h: "End-to-end digital.",
    p: "Online signup, instant analysis, digital packet delivery, electronic filing, real-time status dashboard, automatic notifications. No office visits. No phone tag.",
  },
];

const tiers = [
  {
    name: "AppealReady",
    price: "$149",
    suffix: "flat",
    body: "DIY evidence packet, ready in 5 minutes.",
  },
  {
    name: "AppealManaged",
    price: "30%",
    suffix: "contingency · $0 upfront",
    body: "Full-service appeal. You pay only if we save you money.",
    popular: true,
  },
  {
    name: "AppealPremium",
    price: "$499",
    suffix: "+ 35% contingency",
    body: "White-glove for high-value and commercial properties. Includes PTAB escalation.",
  },
];

const faqs = [
  "How much can I actually save?",
  "What happens if my appeal is denied?",
  "Is this legal? Do I need a lawyer?",
];

const Index = () => {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, every input routes to the stub result page
    navigate("/r/sample-token");
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TaxAppeal AI",
    url: "https://taxappeal.ai",
    logo: "https://taxappeal.ai/favicon.ico",
    description:
      "AI-powered residential property tax appeal service for Cook County and the Illinois collar counties.",
    areaServed: counties.map((c) => ({
      "@type": "AdministrativeArea",
      name: `${c} County, Illinois`,
    })),
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@taxappeal.ai",
      contactType: "customer support",
      areaServed: "US-IL",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TaxAppeal AI",
    url: "https://taxappeal.ai",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://taxappeal.ai/?address={address}",
      "query-input": "required name=address",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much can I save on my Illinois property taxes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Successful Cook County and collar county appeals typically reduce assessed value by 5–15%, translating to several hundred to a few thousand dollars in year-one tax savings depending on your tax rate.",
        },
      },
      {
        "@type": "Question",
        name: "What happens if my property tax appeal is denied?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "On our AppealManaged plan you pay nothing if we don't reduce your assessment. Our flat-fee AppealReady packet is yours regardless of outcome.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a lawyer to appeal my property tax assessment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Homeowners can file Board of Review appeals on their own behalf in every Illinois county we serve. PTAB-stage escalation is handled by partner attorneys when applicable.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="TaxAppeal AI — Lower Your Illinois Property Taxes"
        description="AI-powered property tax appeals for Cook, DuPage, Lake, Will, Kane, and McHenry counties. Free analysis in under 5 minutes — pay nothing unless we save you money."
        path="/"
        jsonLd={[orgJsonLd, websiteJsonLd, faqJsonLd]}
      />
      <SiteHeader />
      <main>
      {/* Hero */}
      <section aria-labelledby="hero-heading" className="container mx-auto max-w-5xl px-6 pt-16 pb-20 sm:pt-24">
        <h1 id="hero-heading" className="font-serif text-4xl leading-[1.05] text-primary sm:text-5xl md:text-6xl">
          See if you're overpaying on Illinois property taxes.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          We compare your home to similar properties in your township and tell
          you, in plain dollars, whether your assessment is out of line.
          Available in Cook, DuPage, Lake, Will, Kane, and McHenry counties.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, Wheaton, IL 60187"
              aria-label="Your home address"
              className="h-14 w-full rounded-md border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 sm:text-lg"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-accent px-7 text-base font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-lg"
          >
            See my analysis
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>
        <p className="mt-3 text-sm text-muted-foreground">
          Free analysis. No account required to see if you're overpaying.
        </p>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="container mx-auto max-w-5xl px-6 py-5">
          <div className="flex flex-col items-start gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary/70" />
              Serving 6 Illinois counties
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary/70" />
              Sub-3% valuation error rate
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary/70" />
              Reports delivered in under 5 minutes
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

      {/* Five pillars */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="container mx-auto max-w-5xl px-6 py-20">
          <h2 className="font-serif text-3xl text-primary sm:text-4xl">
            How TaxAppeal AI is different.
          </h2>
          <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {pillars.map((p, i) => (
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

      {/* Sample evidence packet */}
      <section className="container mx-auto max-w-5xl px-6 py-20">
        <h2 className="font-serif text-3xl text-primary sm:text-4xl">See the work.</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Every customer receives a packet like this. The methodology link
          points to the actual public assessor data we used.
        </p>

        {/* Stylized packet mockup */}
        <div className="mt-10 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          {/* Packet header */}
          <div className="border-b border-border bg-secondary/40 px-6 py-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Evidence packet · 2025 assessment
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
                Appeal recommendation
              </p>
              <p className="mt-1 font-serif text-base text-primary">
                We believe the subject is over-assessed by approximately{" "}
                <span className="text-accent">$18,200</span>.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Estimated year-one tax savings: <span className="text-foreground tabular-nums">~$1,420</span>
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
              Compare plans →
            </a>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
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
        </div>
      </section>

      {/* Counties served */}
      <section className="container mx-auto max-w-5xl px-6 py-20">
        <h2 className="font-serif text-3xl text-primary sm:text-4xl">Counties we serve</h2>
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
            Join the waitlist →
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
