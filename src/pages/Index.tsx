import { useState } from "react";
import { motion } from "framer-motion";
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
import { Button } from "@/components/ui/button";

const trustBullets = [
  "No legal knowledge required",
  "County-ready editable forms",
  "Flat fee, no contingency cut",
  "Built for Illinois homeowners",
];

const steps = [
  {
    icon: Home,
    h: "Enter your PIN.",
    p: "We pull your assessor record and find comparable homes in your township.",
    deliverables: [] as string[],
  },
  {
    icon: BarChart3,
    h: "Get your Fairness Score.",
    p: "We score your assessment against your township and surface every comp that supports a lower valuation.",
    deliverables: [] as string[],
  },
  {
    icon: FileText,
    h: "Download a county-ready packet.",
    p: "File it yourself, online, in minutes. Pre-filled forms, step-by-step instructions.",
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
  { q: "Can I get a refund?", a: "$149 flat. Non-refundable, earned upon receipt — the packet is a complete digital deliverable produced when you purchase." },
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
        title="Property Tax Appeal AI — Free Illinois Fairness Score"
        description="Free Fairness Score for any home in Cook County and the Illinois collar counties. Keep 100% of the savings — no contingency fees."
        path="/"
        jsonLd={[orgJsonLd, faqJsonLd]}
      />
      <SiteHeader />
      <main>
        {/* HERO */}
        <section id="hero" aria-labelledby="hero-heading" className="relative overflow-hidden bg-navy">
          {/* Background Image + Very Subtle Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/bg-img3.png')" }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-b from-navy/30 via-navy/80 to-navy" 
            style={{ opacity: 0.15 }}
          />
          
          <div className="container relative mx-auto flex max-w-7xl flex-col items-center pt-24 pb-28 text-center sm:pt-36 sm:pb-32">

            <motion.h1
              id="hero-heading"
              className="mt-4 type-h1"
              initial="hidden"
              animate="visible"
            >
              <motion.span
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.03 }
                  }
                }}
              >
                {"Your property tax may be wrong.".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 }
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
              <br className="hidden sm:block" />
              <motion.span
                className="text-success"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { delay: 1, staggerChildren: 0.04 }
                  }
                }}
              >
                {"Check it free.".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 }
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            </motion.h1>
 
            <motion.p 
              className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-muted sm:text-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.8, ease: "easeOut" }}
            >
              <span className="relative inline-block">
                {/* Base Slate Layer */}
                <span className="text-navy-muted opacity-100">The average homeowner saves $3,701</span>
                
                {/* White Typing Layer */}
                <motion.span 
                  className="absolute top-0 left-0 text-white overflow-hidden whitespace-nowrap"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 3.5, duration: 1.2, ease: "linear" }}
                >
                  The average homeowner saves $3,701
                </motion.span>
              </span>
              {" "}— and keeps all of it.
            </motion.p>

            {/* Address bar */}
            <div className="animate-fade-up mt-10 w-full max-w-4xl [animation-delay:240ms]">
              <PropertySearch variant="hero" />
            </div>

            {/* Trust strip */}
            <ul className="animate-fade-up mt-6 flex flex-wrap gap-x-5 gap-y-2 type-utility !text-navy-muted [animation-delay:400ms]">
              {trustBullets.map((b) => (
                <li key={b} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-success" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CALCULATOR */}
        <motion.section 
          className="border-t border-border/60 bg-[#F7F9FB]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-24 py-24">
            <p className="type-eyebrow-lg">Keep your Savings</p>
            <h2 className="type-h2 mt-4">
              The contingency-firm math, in one place.
            </h2>
            <p className="type-body-lg mt-6 max-w-5xl">
              Most appeal firms take 35–40% of your year-one savings. <span className="type-body-lg-emph">We charge a flat $149.</span>
            </p>
            <div className="mt-8">
              <SavingsCalculator />
            </div>
          </div>
        </motion.section>

        {/* HOW IT WORKS (TRUST ARCHITECTURE) */}
        <motion.section 
          id="how-it-works" 
          className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-24 py-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="text-left">
            <h2 className="type-h2">How it works</h2>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {steps.map((s, i) => {
              const isLast = i === steps.length - 1;
              return (
                <div key={s.h} className="flex flex-col">
                  {/* Icon & Step Label */}
                  <div className="flex items-center gap-4 mb-6">
                    <s.icon className="h-8 w-8 text-success" />
                    <p className="type-eyebrow-sm text-[#FF9F0A] tracking-wider font-bold">Step {i + 1}</p>
                  </div>

                  <h3 className="type-h4 font-bold text-primary">{s.h}</h3>
                  <p className="type-body-sm mt-3 text-slate leading-relaxed">{s.p}</p>
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.section 
          className="border-t border-border/60 bg-[#F7F9FB]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-24 py-24">
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
        </motion.section>

        {/* WINNETKA EXAMPLE */}
        <motion.section 
          className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-24 py-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
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
        </motion.section>

        <motion.section 
          className="border-t border-border/60 bg-[#F7F9FB]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-24 py-24">
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
                    <span className="absolute -top-3 left-8 rounded-full bg-electric px-4 py-1 text-[12px] font-bold uppercase tracking-widest !text-white shadow-sm">
                      Most popular
                    </span>
                  )}
                  <p className="type-body-lg-emph">{t.name}</p>
                  <p className="mt-4">
                    <span className="type-h3">{t.price}</span>{" "}
                    {t.suffix && <span className="type-body-sm">{t.suffix}</span>}
                  </p>
                  <p className="mt-6 flex-1 type-body-lg">{t.body}</p>
                  {t.waitlist ? (
                    <Button
                      onClick={() => setPremiumOpen(true)}
                      intent="primary"
                      size="small"
                      variant="filled"
                      leadingIcon={Sparkles}
                      className="mt-6"
                    >
                      {t.cta}
                    </Button>
                  ) : (
                    <Button
                      asChild
                      intent={t.popular ? "primary" : "secondary"}
                      size={t.popular ? "large" : "small"}
                      variant="filled"
                      trailingIcon={ArrowRight}
                      className="mt-6"
                    ><a href={t.href}>{t.cta}</a></Button>
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
              <Button
                onClick={() => setTaxWatchOpen(true)}
                intent="primary"
                size="small"
                variant="outline"
                leadingIcon={Zap}
                className="mt-6 sm:mt-0 sm:flex-shrink-0"
              >
                Add Tax Watch
              </Button>
            </div>
          </div>
        </motion.section>

        <motion.section 
          className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-24 py-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
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
              <ul className="mt-6 grid grid-cols-3 gap-3 type-body-sm text-[#1D1D1F]">
                {["Georgia", "Texas", "Florida"].map((s) => (
                  <li key={s} className="rounded-md border border-border bg-card px-3 py-2 text-center">{s}</li>
                ))}
              </ul>
              <p className="mt-8 text-[16px] font-normal text-[#6E6E73]">
                Don't see your county? <a href="/counties" className="font-bold text-electric hover:underline underline-offset-4">Join the notify list →</a>
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section 
          className="border-t border-border/60 bg-[#F7F9FB]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-24 py-32">
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
        </motion.section>

        <motion.section 
          className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-24 py-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="type-eyebrow-lg">FAQ</p>
          <h2 className="type-h2 mt-4">Questions, plainly answered.</h2>
          <Accordion type="single" collapsible className="mt-12 space-y-4">
            {faqs.map((f) => (
              <AccordionItem 
                key={f.q} 
                value={f.q} 
                className="overflow-hidden rounded-2xl border border-border/60 bg-white px-6 shadow-sm transition-all hover:shadow-md"
              >
                <AccordionTrigger className="py-5 text-left type-body-lg-emph text-primary hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 type-body-sm text-slate leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-16 rounded-[30px] border border-electric/30 bg-white p-8 text-center shadow-[0_0_20px_0_rgba(29,29,31,0.08)]">
            <h3 className="type-h3">Ready to see your Fairness Score?</h3>
            <p className="mt-2 type-body-lg">Free. Takes 60 seconds.</p>
            <Button
              asChild
              intent="primary"
              size="large"
              variant="filled"
              trailingIcon={ArrowRight}
              className="mt-8"
            ><a href="#hero">Check my property</a></Button>
          </div>
        </motion.section>
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
