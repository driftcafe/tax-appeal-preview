import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Is this legal advice?", a: "No. TaxAppeal.app prepares data and documents for homeowners filing pro se. We do not provide legal advice or representation." },
  { q: "Do you guarantee my taxes will go down?", a: "No. Outcomes depend on county review, evidence quality, and local rules. We provide data, analysis, and organized documents to support your filing." },
  { q: "What does \"lack of uniformity\" mean?", a: "Your home may be assessed more aggressively than similar nearby homes. Illinois law allows appeals based on this." },
  { q: "Will the county punish me for appealing?", a: "No. Appeals are a routine, lawful process used by thousands of Illinois homeowners every year." },
  { q: "What if I miss the deadline?", a: "You'd have to wait until next year. Tax Watch sends township-specific reminders so you don't miss it." },
  { q: "What's the difference between $149 and $399?", a: "The $149 toolkit gives you everything you need to file. The $399 tier adds AI-driven analysis, comp quality ranking, risk flags, and a polished report — recommended if you want extra confidence before submitting." },
  { q: "Can I get a refund?", a: "Yes, within 7 days if you haven't downloaded your packet." },
];

const faqJsonLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const FAQ = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO title="FAQ — TaxAppeal.app" description="Common questions about TaxAppeal.app — pricing, refunds, deadlines, and what we do and don't do." path="/faq" jsonLd={[faqJsonLd]} />
    <SiteHeader />
    <main>
      <section className="container mx-auto max-w-3xl px-6 pt-16 pb-6 sm:pt-24">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">FAQ</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">Questions, plainly answered.</h1>
      </section>
      <section className="container mx-auto max-w-3xl px-6 py-10">
        <Accordion type="single" collapsible className="divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-0">
              <AccordionTrigger className="text-left text-base font-medium text-primary">{f.q}</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default FAQ;
