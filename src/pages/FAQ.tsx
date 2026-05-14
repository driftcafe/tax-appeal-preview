import { motion } from "framer-motion";
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
  { q: "Can I get a refund?", a: "$149 flat. Non-refundable, earned upon receipt — the packet is a complete digital deliverable produced when you purchase." },
];

const faqJsonLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const FAQ = () => (
  <div className="flex min-h-screen flex-col bg-background text-foreground">
    <SEO title="FAQ — TaxAppeal.app" description="Common questions about TaxAppeal.app — pricing, refunds, deadlines, and what we do and don't do." path="/faq" jsonLd={[faqJsonLd]} />
    <SiteHeader />
    <main className="flex-1">
      <motion.section 
        className="container mx-auto max-w-7xl px-8 pt-16 pb-10 sm:pt-24 md:px-12 lg:px-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="type-eyebrow-lg">FAQ</p>
        <h2 className="mt-4 type-h2 text-primary">Questions, plainly answered.</h2>
      </motion.section>

      <motion.section 
        className="container mx-auto max-w-7xl px-8 py-10 md:px-12 lg:px-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
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
        </div>
      </motion.section>
    </main>
    <SiteFooter />
  </div>
);

export default FAQ;
