import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    n: "01",
    h: "Enter your PIN.",
    p: "Enter your Property Index Number — found on your most recent property tax bill or assessment notice, or via your county assessor's lookup site. We pull your current assessed value, property characteristics, and recent sales history directly from public county records.",
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
    p: 'You get the full Data Report (PDF) and a pre-filled, editable appeal template formatted for your jurisdiction — labeled "DRAFT TEMPLATE — HOMEOWNER MUST REVIEW, EDIT, AND FILE." Factual fields (PIN, address, assessed value) are pre-populated. The rest is yours to complete.',
  },
  {
    n: "06",
    h: "Review, edit, and file yourself.",
    p: "Read the report. Edit the template as you see fit. Print or e-file with your local board of review using the step-by-step instructions we include. We do not file on your behalf and we do not represent you.",
  },
];

const HowItWorks = () => (
  <div className="flex min-h-screen flex-col bg-background text-foreground">
    <SEO
      title="How It Works — TaxAppeal.app"
      description="Six steps from PIN entry to a filed appeal: comparison report, editable template, and you stay in control. Flat $149."
      path="/how-it-works"
    />
    <SiteHeader />
    <main className="flex-1">
      <motion.section 
        className="container mx-auto max-w-7xl px-8 pt-16 pb-10 sm:pt-24 md:px-12 lg:px-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="type-eyebrow-lg">How it works</p>
        <h2 className="mt-4 type-h2 text-primary">
          Public data in. A report and an editable template out.
        </h2>
        <p className="mt-6 type-body-lg text-slate max-w-2xl">
          We organize publicly available property records into a clear comparison and a pre-filled
          appeal template. You stay the decision-maker, the editor, and the filer.
        </p>
      </motion.section>

      <motion.section 
        className="container mx-auto max-w-7xl px-8 py-10 md:px-12 lg:px-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="space-y-12">
          {steps.map((s) => (
            <div key={s.n} className="flex gap-8">
              <div className="type-h2 text-success/40 tabular-nums">{s.n}</div>
              <div>
                <h2 className="type-body-lg-emph text-primary">{s.h}</h2>
                <p className="mt-2 type-body-sm text-slate leading-relaxed">{s.p}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section 
        className="container mx-auto max-w-7xl px-8 py-16 md:px-12 lg:px-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="rounded-[30px] border border-border/60 bg-white p-8 shadow-[0_0_20px_0_rgba(29,29,31,0.08)]">
          <h2 className="type-h3">Two kinds of documents — never blended</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <p className="type-eyebrow-sm text-electric">Data Report</p>
              <p className="mt-3 type-body-sm text-slate">
                Read-only PDF. Labeled "FOR INFORMATIONAL PURPOSES ONLY." Shows comparable properties,
                ratios, and side-by-side comparisons. You don't file this with anyone.
              </p>
            </div>
            <div>
              <p className="type-eyebrow-sm text-electric">Editable Template</p>
              <p className="mt-3 type-body-sm text-slate">
                Editable PDF or Word document. Labeled "HOMEOWNER MUST REVIEW, EDIT, AND FILE."
                Only factual fields are pre-filled; you complete and submit it yourself.
              </p>
            </div>
          </div>
        </div>

        <Button
          asChild
          intent="primary"
          size="large"
          variant="filled"
          trailingIcon={ArrowRight}
          className="mt-12"
        >
          <Link to="/">Enter your PIN to start</Link>
        </Button>
      </motion.section>
    </main>
    <SiteFooter />
  </div>
);

export default HowItWorks;